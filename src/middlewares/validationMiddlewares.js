const AppError = require("../utils/appError")

exports.signupValidator = (req, _, next) => {
    const { email, name, password, confirmPassword } = req.body
    if(!email || !name || !password || !confirmPassword) return next(new AppError('Please fill all the required fields', 400))

    next()
}

exports.loginValidator = (req, _, next) => {
    const { email, password } = req.body
    if(!email || !password) return next(new AppError('Please provide an email and a password', 400))

    next()
}