exports.errorName = {
  NOTFOUND: 'NOTFOUND',
};

const errorTypes = {
  NOTFOUND: { message: 'Requested record not found', statusCode: 404 },
};
exports.errorTypes = errorTypes;

exports.getErrorCode = name => {
  const errorType = errorTypes[name];
  return errorType;
};

const formatError = err => err;

module.exports = formatError;
