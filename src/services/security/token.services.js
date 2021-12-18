const { promisify } = require('util');
const jwt = require('jsonwebtoken');

exports.generateToken = payload =>
  jwt.sign(
    payload,
    process.env.JWT_AUTH_SECRET, // The secret should atleast 32 characters long
    { expiresIn: process.env.JWT_AUTH_EXPIRES_IN }
  );

exports.verifyToken = async token =>
  await promisify(jwt.verify)(token, process.env.JWT_AUTH_SECRET);
