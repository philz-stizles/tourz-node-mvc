import { Request, Response, NextFunction } from 'express';

import AppError from '@src/errors/app.error';

export const signupValidator = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { email, username, password, confirmPassword } = req.body;
  if (!email || !username || !password || !confirmPassword)
    return next(new AppError(400, 'Please fill all the required fields'));

  next();
};

export const loginValidator = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError(400, 'Please provide an email and a password'));

  next();
};
