import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { Request, Response } from 'express';
import { ENV } from '../../config/env.js';

const prisma = new PrismaClient();

export const verify2FA = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, code } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user || !user.two_factor_secret) {
      return res.status(400).json({ success: false, message: '2FA is not configured for this user.' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.two_factor_secret,
      encoding: 'base32',
      token: code,
      window: 1,
    });

    if (!verified) {
      return res.status(400).json({ success: false, message: 'Invalid 2FA code.' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      message: '2FA verification successful! Login complete.',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('2FA verify error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
