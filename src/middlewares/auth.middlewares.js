const User = require('../models/user.model');
const AppError = require('../errors/app.error');
const { verifyToken } = require('../services/security/token.services');
const { catchAsync } = require('../utils/api.utils');

exports.authenticate = catchAsync(async (req, res, next) => {
  // Check if there is a token
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token)
    return next(new AppError('You are not logged in. Please log', 401));

  // Check if token is valid
  const decodedToken = await verifyToken(token);
  if (!decodedToken)
    return next(new AppError('You are not authorized. Please log', 401));

  // Check if user exists(or if a previously existing user with a valid token has been deleted)
  // and return user if true
  const existingUser = await User.findById(decodedToken.id);
  if (!existingUser)
    return next(
      new AppError('You no longer have acccess to this resource', 401)
    );

  // Check if user changed password after JWT was created
  const passwordChangedAfterTokenGen =
    existingUser.isPasswordChangedAfterTokenGen(decodedToken.iat);
  if (passwordChangedAfterTokenGen)
    return next(
      new AppError(
        'User recently changed their password! Please log in again.',
        401
      )
    );

  // Grant access to protected route
  req.user = existingUser;
  res.locals.user = existingUser; // For view
  res.locals.isAuthenticated = true; // For view

  next();
});

exports.isAuthenticatedWith2FA =
  (omitSecondFactor = false) =>
  async (req, res, next) => {
    let token = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token)
      return next(new AppError(401, 'You are not logged in. Please log'));

    // Check if token is valid
    const decodedToken = await verifyToken(token);
    if (!decodedToken)
      return next(new AppError(401, 'You are not authorized. Please log'));

    const { id, isSecondFactorAuthenticated } = decodedToken;
    // Check if user exists(or if a previously existing user with a valid token has been deleted)
    // and return user if true
    const existingUser = await User.findById(id);
    if (!existingUser)
      return next(
        new AppError(401, 'You no longer have access to this resource')
      );

    if (
      !omitSecondFactor &&
      existingUser.isTwoFactorAuthenticationEnabled &&
      !isSecondFactorAuthenticated
    ) {
      return next(new AppError(401, 'Wrong authentication token'));
    } else {
      // Grant access to protected route
      req.user = existingUser;
      next();
    }
  };

exports.authorize = (...authorizedUsers) =>
  catchAsync(async (req, _, next) => {
    if (!authorizedUsers.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have the permission to perform this action',
          403
        )
      );
    }

    next();
  });

exports.authenticateView = catchAsync(async (req, res, next) => {
  if (req.cookies.token) {
    try {
      // Check if token is valid
      const decodedToken = await verifyToken(req.cookies.token);
      if (!decodedToken) {
        return next();
      }

      // Check if user exists(or if a previously existing user with a valid token has been deleted)
      // and return user if true
      const existingUser = await User.findById(decodedToken.id);
      if (!existingUser) {
        return next();
      }

      // Check if user changed password after JWT was created
      const passwordChangedAfterTokenGen =
        existingUser.isPasswordChangedAfterTokenGen(decodedToken.iat);
      if (passwordChangedAfterTokenGen) {
        return next();
      }

      // Grant access to protected route
      res.locals.user = existingUser;
      res.locals.isAuthenticated = true;

      return next();
    } catch (error) {
      return next();
    }
  }

  next();
});

exports.hasBooking = catchAsync(async (req, _, next) => {
  const { tour } = req.body;
  const existingBooking = await Booking.findOne({ tour, creator: req.user.id });
  if (!existingBooking) {
    return next(
      new AppError('You do not have the permission to perform this action', 403)
    );
  }

  next();
});
