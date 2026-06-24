import { PrismaClient } from '@prisma/client';
import speakeasy from 'speakeasy';
import { Request, Response } from 'express';
import { ENV } from '../../config/env.js';

const prisma = new PrismaClient();

export const setup2FA = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.body;

    const secret = speakeasy.generateSecret({
      name: `${ENV.APP_NAME} (${userId})`,
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        two_factor_secret: secret.base32,
        two_factor_enabled: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: '2FA configured successfully.',
      secret: secret.base32,
      otpauth_url: secret.otpauth_url,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
