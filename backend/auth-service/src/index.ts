import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app: Application = express();

// 1. Extract allowed origins aur trim lagayein taa ke spaces ka namo-nishaan na rahe
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

// 🟢 Debug log lagayein taa ke Render logs mein pata chale backend ne kya load kiya
console.log("🔒 Loaded Allowed Origins:", allowedOrigins);

// 2. Dynamic CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    // Agar origin missing hai (e.g., Postman ya health checks), tou allow karein
    if (!origin) return callback(null, true);

    // 🟢 Debug log browser se aane wali incoming request dekhne ke liye
    console.log(`📡 Incoming Origin: ${origin} | Allowed: ${allowedOrigins.includes(origin)}`);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // pipeline crash nahi hogi
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
});