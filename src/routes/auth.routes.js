const express = require('express');
const router = express.Router();
const {
  signup,
  login,
  loginWith2FA,
  turnOnTwoFactorAuth,
  generateTwoFactorAuthCode,
  secondFactorAuthentication,
  forgotPassword,
  resetPassword,
  logoutCookie,
} = require('../controllers/auth.controllers');
const {
  loginValidator,
  signupValidator,
} = require('../middlewares/validationMiddlewares');
const {
  authenticate,
  isAuthenticatedWith2FA,
} = require('../middlewares/auth.middlewares');

router.post('/signup', signupValidator, signup);
router.post('/login', loginValidator, login);
router.post('/login-with-2fa', loginValidator, loginWith2FA);
router.post(
  '/2fa/generate',
  isAuthenticatedWith2FA(),
  generateTwoFactorAuthCode
);
router.post('/2fa/turn-on', isAuthenticatedWith2FA(), turnOnTwoFactorAuth);

router.post(
  '/2fa/authenticate',
  isAuthenticatedWith2FA(true),
  secondFactorAuthentication
);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.get('/logout', logoutCookie);

module.exports = router;
