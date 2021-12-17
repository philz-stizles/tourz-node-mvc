import express from 'express';
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  logoutCookie,
} from '@src/controllers/auth.controllers';
import {
  loginValidator,
  signupValidator,
} from '@src/middlewares/validation.middlewares';

const router = express.Router();

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/change-password', changePassword);
router.get('/logout', logoutCookie);

export default router;
