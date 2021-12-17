class AppError extends Error {
  statusCode: number;

  status: boolean;

  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = false;
    // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
