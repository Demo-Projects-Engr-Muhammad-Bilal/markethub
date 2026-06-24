import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ENV } from '../../config/env.js';

const prisma = new PrismaClient();

const STATUS_MESSAGES: Record<string, string> = {
  pending: 'Your account is pending approval. You can login once the Admin approves it.',
  rejected: 'Your account registration was rejected during verification.',
  blocked: 'Your account has been blocked due to policy violations.',
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password, role } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.password_hash) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    if (!role) {
      return res.status(400).json({ success: false, message: "App role is missing from request." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.role.toLowerCase() !== role.toLowerCase()) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You are registered as a ${user.role}, but trying to access the ${role} portal.`
      });
    }

    if (!user.is_email_verified) {
      return res.status(403).json({
        success: false,
        message: 'Your email is not verified. Please check your inbox for the verification link.'
      });
    }

    if (user.status !== 'approved') {
      const message = STATUS_MESSAGES[user.status] || 'Account not approved.';
      return res.status(403).json({ success: false, message });
    }


    // Roles that require 2FA before full login
    if (ENV.ROLES_WITH_2FA.includes(user.role)) {
      if (user.two_factor_enabled && user.two_factor_secret) {
        return res.status(200).json({
          success: true,
          require2FA: true,
          action: 'verify',
          userId: user.id,
          message: 'Two-Factor Authentication required. Please provide your OTP code.',
        });
      } else {
        return res.status(200).json({
          success: true,
          require2FA: true,
          action: 'setup',
          userId: user.id,
          message: 'Please setup Two-Factor Authentication first.',
        });
      }
    }

    // Replace your existing jwt.sign block with this:
    const token = jwt.sign(
      { id: user.id, role: user.role },
      ENV.JWT_SECRET as string, // 🟢 Explicitly cast to string
      {
        expiresIn: ENV.JWT_EXPIRES_IN as any // 🟢 Cast to any to bypass the type definition issue
      }
    );
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
