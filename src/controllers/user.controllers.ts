import { NextFunction, Request, Response } from 'express';
import User from '@src/models/user.model';
import {
  filterRequestBody,
  createAndSendTokenWithCookie
} from '@src/utils/api.utils';
import AppError from '@src/errors/app.error';
import { generateToken } from '@src/utils/auth.utils';
import { catchAsync } from '@src/utils/api.utils';
import * as factory from '@src/factories/handler.factory';

export const createUser = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;

  const newUser = await User.create({ name, email, password, confirmPassword });

  const token = generateToken(newUser);

  newUser.password = undefined;
  res.status(201).json({
    status: true,
    data: {
      loggedInUser: newUser,
      token
    },
    message: 'created successfully'
  });
});

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check that password is not being updated here
    if (req.body.password || req.body.confirmPassword) {
      return next(new AppError(400, 'You cannot update passwords'));
    }

    const filteredBody = filterRequestBody(req.body, 'name', 'email');

    // Check if a file was uploaded
    if (req.file) {
      filteredBody.photo = req.file.filename;
    }

    // We use User.findByIdAndUpdate() now since we are not updating password and thus do not require validations
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      status: true,
      data: updatedUser,
      message: 'Updated successfully'
    });
  }
);

export const deleteMe = catchAsync(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(204).json({ status: true, data: null });
});

export const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists - Find the user by id
    const existingUser = await User.findById(req.user._id).select('+password');
    if (!existingUser) return next(new AppError(400, 'user invalid'));

    // Verify current password
    if (!(await existingUser.comparePassword(req.body.currentPassword))) {
      return next(new AppError(401, 'Your current password is wrong'));
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
  }
);

// USING HANDLER FACTORY
export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

// MIDDLEWARES
export const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user._id.toString();
    next();
  }
);
