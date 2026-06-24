import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { sendVerificationEmail } from '../../utils/emailservice.js';

const prisma = new PrismaClient();

const getFrontendUrl = (role: string): string => {
  const base = process.env.CUSTOMER_FRONTEND_URL || "http://localhost:3000";
  switch (role.toLowerCase()) {
    case 'seller':
      return process.env.SELLER_FRONTEND_URL || base;
    case 'dropshipper':
      return process.env.DROPSHIPPER_FRONTEND_URL || base;
    case 'customer':
      return base;
    default:
      return base;
  }
};

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password, role, phone_number } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists!' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const userRole = role || 'customer';
    const initialStatus = userRole === 'customer' ? 'approved' : 'pending';
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password_hash,
        role: userRole,
        phone_number,
        status: initialStatus,
        is_email_verified: false,
        email_verification_token: verificationToken,
      },
    });

    const frontendUrl = getFrontendUrl(userRole);
    const verificationLink = `${frontendUrl}/auth?view=verify-email&token=${verificationToken}`;

    // 🟢 ISOLATION WORK: Try-catch wrap taa ke email delivery block handling bypass ho sakay
    try {
      await sendVerificationEmail(email, username, newUser.role, verificationLink);
    } catch (emailError) {
      console.warn('⚠️ WARNING: Resend verification email failed to dispatch:', emailError);
      // Testing optimization layer fallback token check log console panel par print kar rahe hain
      console.log(`🔗 Dev Environment Link: ${verificationLink}`);
    }

    return res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account (Dev-Mode Bypass Active).',
      userId: newUser.id,
    });

  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};