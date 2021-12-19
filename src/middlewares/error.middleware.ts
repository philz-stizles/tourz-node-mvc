import { Request, Response, NextFunction } from 'express';

// eslint-disable-next-line no-unused-vars
export default (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status ? err.status : 500;
  const message = err.message ? err.message : 'Please try again later';

  // eslint-disable-next-line no-console
  console.log(err.message);

  return res.status(status).json({ status: false, message });
};
