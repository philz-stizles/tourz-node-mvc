import { NextFunction, Request, Response } from 'express';

export const alerts = (req: Request, res: Response, next: NextFunction) => {
  const { alert } = req.query;

  switch (alert) {
    case 'booking':
      res.locals.alert =
        'Your booking was successful!. Please check your email for confirmations.';
      break;

    default:
      break;
  }

  next();
};
