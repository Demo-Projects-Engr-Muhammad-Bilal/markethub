import { Router } from 'express';
import {
  register,
  login,
  setup2FA,
  verify2FA,
  forgotPassword,
  resetPassword,
  googleLogin,
  verifyEmail
} from '../controllers/index.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/setup-2fa', setup2FA);
router.post('/verify-2fa', verify2FA);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google', googleLogin);
router.post("/verify-email", verifyEmail);

export default router;
