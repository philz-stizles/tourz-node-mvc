class AppError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = false;
    // this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
