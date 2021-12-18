const AppError = require('../errors/app.error');

exports.signupValidator = (req, _, next) => {
  const { email, username, password, confirmPassword } = req.body;
  if (!email || !username || !password || !confirmPassword)
    return next(new AppError('Please fill all the required fields', 400));

  next();
};

exports.loginValidator = (req, _, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide an email and a password', 400));

  next();
};
