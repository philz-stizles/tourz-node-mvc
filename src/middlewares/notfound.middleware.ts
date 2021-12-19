import { Request, Response } from 'express';

const notFoundHandler = (_request: Request, res: Response) => {
  const message = 'Resource not found';

  res.status(404).json({ status: false, message });
};

export default notFoundHandler;
