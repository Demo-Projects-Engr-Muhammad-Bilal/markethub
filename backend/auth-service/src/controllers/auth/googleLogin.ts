import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { ENV } from '../../config/env.js';

const prisma = new PrismaClient();

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

export const googleLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const { code, role } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code is required.' });
    }

    // Exchange authorization code for tokens
    const tokenResponse = await axios.post(GOOGLE_TOKEN_URL, {
      code,
      client_id: ENV.GOOGLE_CLIENT_ID,
      client_secret: ENV.GOOGLE_CLIENT_SECRET,
      redirect_uri: ENV.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    const { access_token } = tokenResponse.data;

    // Fetch user profile from Google
    const userInfoResponse = await axios.get(GOOGLE_USERINFO_URL, {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name } = userInfoResponse.data;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Could not retrieve email from Google.' });
    }

    // Upsert user — create if not exists, return existing if already registered
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: name || 'Google User',
          auth_provider: 'google',
          role: role || 'customer',
          status: 'approved',
        },
      });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      success: true,
      message: 'Google Sign-In successful!',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error('Google auth error:', error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Google Authentication Failed' });
  }
};
