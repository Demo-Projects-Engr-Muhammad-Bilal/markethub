import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { Request, Response } from 'express';
import { sendResetEmail } from '../../utils/emailservice.js';
import { ENV } from '../../config/env.js';

const prisma = new PrismaClient();

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset token has been sent.',
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(
      Date.now() + ENV.RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
    );

    await prisma.user.update({
      where: { email },
      data: {
        reset_password_token: resetToken,
        reset_password_expires: resetTokenExpiry,
      },
    });

    // 🟢 ISOLATION WORK: Token is saved, email failures will be bypassed gracefully as warning
    try {
      await sendResetEmail(email, resetToken);
    } catch (emailError) {
      console.warn('⚠️ WARNING: Reset password notification dispatch bypassed:', emailError);
      console.log(`🔑 Generated Reset Token for Dev-Logs: ${resetToken}`);
    }

    return res.status(200).json({
      success: true,
      message: 'Password reset token processes has been initiated.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};