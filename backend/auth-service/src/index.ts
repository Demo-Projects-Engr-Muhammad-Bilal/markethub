import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import type { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';

const app: Application = express();

// 1. Extract allowed origins from the comma-separated .env variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : [];

// 2. Dynamic CORS Configuration (Fixed for Preflight OPTIONS Request)
app.use(cors({
  origin: function (origin, callback) {
    // Agar origin missing hai (e.g., Postman ya server-to-server calls), tou allow karein
    if (!origin) return callback(null, true);

    // Check karein ke origin hamari allowed list mein hai ya nahi
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // 🟢 FIX: Error throw karne ke bajaye 'false' pass karein taa ke pipeline crash na ho
      callback(null, false);
    }
  },
  credentials: true, // Cookies/tokens bhejne ke liye zaroori hai
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Auth Service running on port ${PORT}`);
});