const notFoundHandler = (_request, response) => {
  const message = 'Resource not found';

  response.status(404).send({ status: false, message });
};

module.exports = notFoundHandler;
