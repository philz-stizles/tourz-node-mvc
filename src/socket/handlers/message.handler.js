exports.createMessage = payload => {
  console.log(payload);
};

exports.readMessage = (payload, callback) => {
  console.log(payload);
  callback();
};
