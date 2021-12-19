const { sendPlainEmail } = require('../services/email/nodemailer');
const AppError = require('../errors/app.error');
const { generateToken } = require('../services/security/token.services');
const { catchAsync } = require('../utils/api.utils');
const crypto = require('crypto');
const User = require('../models/user.model');
const { createAndSendTokenWithCookie } = require('../utils/api.utils');
const {
  getTwoFactorAuthenticationCode,
  verifyTwoFactorAuthenticationCode,
  respondWithQRCode,
} = require('../services/security/auth.services');

// Authentication ***************************************************************** |
exports.signup = catchAsync(async (req, res) => {
  const { username, fullname, email, password, confirmPassword } = req.body;

  const newUser = await User.create({
    username,
    fullname,
    email,
    password,
    confirmPassword,
  });

  const token = newUser.generateToken();

  res.status(201).json({
    status: true,
    data: {
      loggedInUser: newUser,
      token,
    },
    message: 'created successfully',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email }).select('+password'); // There is difference between adding
  // +password and just password. +password will add to already visible fields if not already visible
  // password without the + would select just that field as visible and will continue to include any new fields that
  // you specify to the list of included fields. The _id is always returned accept you specify otherwise
  // e.g .select('+password -_id')
  if (!existingUser)
    return next(new AppError('Incorrect email or password', 401));

  // Check if password matches
  const isMatch = await existingUser.comparePassword(password);
  if (!isMatch) return next(new AppError('Incorrect email or password', 401));

  // Generate token
  const token = generateToken(existingUser);

  createAndSendTokenWithCookie(existingUser, 200, req, res, 'Login successful');
});

exports.loginWith2FA = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email }).select('+password'); // There is difference between adding
  // +password and just password. +password will add to already visible fields if not already visible
  // password without the + would select just that field as visible and will continue to include any new fields that
  // you specify to the list of included fields. The _id is always returned accept you specify otherwise
  // e.g .select('+password -_id')
  if (!existingUser)
    return next(new AppError(401, 'Incorrect email or password'));

  // Check if password matches
  const isMatch = await existingUser.comparePassword(password);
  if (!isMatch) return next(new AppError(401, 'Incorrect email or password'));

  // Generate token and set cookie.
  existingUser.setCookieToken(req, res);

  // If 2FA.
  if (existingUser.isTwoFactorAuthenticationEnabled) {
    res.json({
      status: true,
      data: {
        isTwoFactorAuthenticationEnabled: true,
      },
      message: 'login with 2FA',
    });
  } else {
    res.json({
      status: true,
      data: {
        ...existingUser.toObject(),
        isTwoFactorAuthenticationEnabled: false,
      },
      message: 'login successfully',
    });
  }
});

// 2FA ************************************************************************* |

exports.generateTwoFactorAuthCode = catchAsync(async (req, res, next) => {
  // Generate 2FA code.
  const { otpauthUrl, base32 } = getTwoFactorAuthenticationCode();

  // Save 2FA code in the database.
  await User.findByIdAndUpdate(req.user.id, {
    twoFactorAuthenticationCode: base32,
  });

  respondWithQRCode(otpauthUrl, res);
});

exports.turnOnTwoFactorAuth = catchAsync(async (req, res, next) => {
  const { twoFactorAuthenticationCode } = req.body;
  const user = req.user;
  const isCodeValid = await verifyTwoFactorAuthenticationCode(
    twoFactorAuthenticationCode,
    user
  );
  if (!isCodeValid) {
    return next(new AppError(401, 'Incorrect email or password'));
  }

  await User.findByIdAndUpdate(user._id, {
    isTwoFactorAuthenticationEnabled: true,
  });

  res.json({ success: true, message: '2FA enabled successfully' });
});

exports.secondFactorAuthentication = async (req, res, next) => {
  const { twoFactorAuthenticationCode } = req.body;
  const user = req.user;

  const isCodeValid = await verifyTwoFactorAuthenticationCode(
    twoFactorAuthenticationCode,
    user
  );
  if (!isCodeValid) {
    return next(new AppError(401, 'Code is not valid'));
  }

  user.setCookieToken(req, res, true);

  res.send({
    ...user.toObject(),
    password: undefined,
    twoFactorAuthenticationCode: undefined,
  });
};

// Forgot Password ************************************************************* |
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Validate user email
  const existingUser = await User.findOne({ email: req.body.email });
  if (!existingUser)
    return next(new AppError('User with email address does not exist', 401));

  // Generate reset password token
  const passwordResetToken = existingUser.createPasswordResetToken();
  await existingUser.save({ validateBeforeSave: false }); // At this point you are setting password reset token and saving
  // The save method will run validations on inputs and will fail due to the lack of for example confirm password etc
  // set validateBeforeSave: false for this particular operation as we do not need confirm password validation here

  // Send to user as an email
  const resetPasswordUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${passwordResetToken}`;
  const message = `Forgot your password, submit a request with your new password and password confirm
        to: ${resetPasswordUrl}.\nIf you didn't forget your password, please ignore this email
    `;
  const subject = 'Reset your password(valid for 10mins)';

  try {
    await sendPlainEmail({ email: existingUser.email, subject, message });

    res.json({
      status: true,
      message: 'Password reset has been sent to email',
    });
  } catch (error) {
    existingUser.passwordResetToken = undefined;
    existingUser.passwordResetExpiresIn = undefined;
    existingUser.save();
    // await existingUser.save({ validateBeforeSave: false })
    return next(
      new AppError(
        'Cannot send password reset email at the moment, please try again later',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Hash unhashed password reset token
  const currentHashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // Find a user with this hashed token
  const existingUser = await User.findOne({
    passwordResetToken: currentHashedToken,
    passwordResetExpiresIn: { $gt: Date.now() },
  });
  if (!existingUser)
    return next(new AppError('Token is either invalid or has expired', 400));

  existingUser.password = req.body.password;
  existingUser.confirmPassword = req.body.confirmPassword;
  existingUser.passwordResetToken = undefined;
  existingUser.passwordResetExpiresIn = undefined;
  await existingUser.save();

  // Generate token
  const token = generateToken(existingUser);

  res.json({ status: true, data: token, message: 'Password reset successful' });
});

exports.logoutCookie = catchAsync(async (req, res, next) => {
  res.cookie('token', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.json({ status: true, message: 'Logout successful' });
});
