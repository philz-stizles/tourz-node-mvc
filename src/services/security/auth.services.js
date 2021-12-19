const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.respondWithQRCode = (data, response) => {
  QRCode.toFileStream(response, data);
};

exports.getTwoFactorAuthenticationCode = () => {
  const secretCode = speakeasy.generateSecret({
    name: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
  });
  return {
    otpauthUrl: secretCode.otpauth_url,
    base32: secretCode.base32,
  };
};

exports.verifyTwoFactorAuthenticationCode = (
  twoFactorAuthenticationCode,
  user
) => {
  return speakeasy.totp.verify({
    secret: user.twoFactorAuthenticationCode,
    encoding: 'base32',
    token: twoFactorAuthenticationCode,
  });
};
