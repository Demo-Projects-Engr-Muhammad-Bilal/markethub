import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const verifyEmail = async (req: Request, res: Response): Promise<any> => {
          try {
                    const { token } = req.body;

                    if (!token) {
                              return res.status(400).json({ success: false, message: 'Verification token is missing.' });
                    }

                    // Token ke zariye user find karein
                    const user = await prisma.user.findFirst({
                              where: { email_verification_token: token }
                    });

                    if (!user) {
                              return res.status(400).json({ success: false, message: 'Invalid or expired verification token.' });
                    }

                    // User ka record update karein (verify email & remove token)
                    await prisma.user.update({
                              where: { id: user.id },
                              data: {
                                        is_email_verified: true,
                                        email_verification_token: null,
                              }
                    });

                    return res.status(200).json({
                              success: true,
                              message: 'Email verified successfully! You can now log in to your account.'
                    });
          } catch (error) {
                    console.error('Verify email error:', error);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
          }
};