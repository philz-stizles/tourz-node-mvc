import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutCookie
} from '@src/controllers/auth.controllers';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/change-password', changePassword);
router.get('/logout', logoutCookie);

export default router;
