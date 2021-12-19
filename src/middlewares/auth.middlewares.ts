import { Response, NextFunction, Request } from 'express';
import { IAuthRequest } from '@src/interfaces/AuthRequest';
import User from '../models/user.model';
import AppError from '../errors/app.error';
import { verifyToken } from '../utils/auth.utils';
import { catchAsync } from '@src/utils/api.utils';
import { IJWTokenPayload } from '@src/interfaces/JsonWebToken';

export const isAuthenticated = catchAsync(
  async (req: IAuthRequest, res: Response, next: NextFunction) => {
    // Check if there is a token
    let token = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      // eslint-disable-next-line prefer-destructuring
      token = req.cookies.token;
    }

    if (!token)
      return next(new AppError(401, 'You are not logged in. Please log'));

    // Check if token is valid
    const decodedToken: IJWTokenPayload | undefined = await verifyToken(token);
    if (!decodedToken)
      return next(new AppError(401, 'You are not authorized. Please log'));

    // Check if user exists(or if a previously existing user with a valid token has been deleted)
    // and return user if true
    const existingUser = await User.findById(decodedToken.id);
    if (!existingUser)
      return next(
        new AppError(401, 'You no longer have access to this resource')
      );

    // Check if user changed password after JWT was created passing the issued at(iat) value
    const passwordChangedAfterTokenGen =
      existingUser.isPasswordChangedAfterTokenGen(decodedToken.iat);
    if (passwordChangedAfterTokenGen)
      return next(
        new AppError(
          401,
          'User recently changed their password! Please log in again.'
        )
      );

    // Grant access to protected route
    req.user = existingUser;
    res.locals.user = existingUser; // For view
    res.locals.isAuthenticated = true; // For view

    return next();
  }
);

export const isAuthorized = (
  ...authorizedUsers: string[]
): // eslint-disable-next-line no-unused-vars
((req: Request, res: Response, next: NextFunction) => void) =>
  catchAsync(async (req: IAuthRequest, res: Response, next: NextFunction) => {
    if (req.user.roles.some((role: string) => authorizedUsers.includes(role))) {
      return next(
        new AppError(
          403,
          'You do not have the permission to perform this action'
        )
      );
    }

    return next();
  });

export const isAuthenticatedView = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies.token) {
      try {
        // Check if token is valid
        const decodedToken: IJWTokenPayload | undefined = await verifyToken(
          req.cookies.token
        );
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
      } catch (error: any) {
        return next();
      }
    }

    return next();
  }
);
