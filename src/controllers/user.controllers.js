const User = require('../models/user.model');
const {
  filterRequestBody,
  createAndSendTokenWithCookie,
} = require('../utils/api.utils');
const AppError = require('../errors/app.error');
const { generateToken } = require('../services/security/token.services');
const { catchAsync } = require('../utils/api.utils');
const factory = require('./handler.factory');

exports.createUser = catchAsync(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({ name, email, password, confirmPassword });

  const token = generateToken(newUser);

  newUser.password = undefined;
  res.status(201).json({
    status: true,
    data: {
      loggedInUser: newUser,
      token,
    },
    message: 'created successfully',
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // Check that password is not being updated here
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('You cannot update passwords', 400));
  }

  const filteredBody = filterRequestBody(req.body, 'name', 'email');

  // Check if a file was uploaded
  if (req.file) {
    filteredBody.photo = req.file.filename;
  }

  // We use User.findByIdAndUpdate() now since we are not updating password and thus do not require validations
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.json({
    status: true,
    data: updatedUser,
    message: 'Updated successfully',
  });
});

exports.deleteMe = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(204).json({ status: true, data: null });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  // Check if user exists - Find the user by id
  const existingUser = await User.findById(req.user.id).select('+password');
  if (!existingUser) return next(new AppError('user invalid', 400));

  // Verify current password
  if (!(await existingUser.comparePassword(req.body.currentPassword))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  // set new password
  existingUser.password = req.body.password;
  existingUser.confirmPassword = req.body.confirmPassword;
  await existingUser.save();
  // User.findByIdAndUpdate will not work as intended if used here

  // Generate token and respond to API request
  createAndSendTokenWithCookie(
    existingUser,
    200,
    req,
    res,
    'Password changed successfully'
  );
});

// USING HANDLER FACTORY
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// MIDDLEWARES
exports.getMe = catchAsync(async (req, res) => {
  req.params.id = req.user.id;
  next();
});
