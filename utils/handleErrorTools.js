const handleErrorConstructor = (status, message) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};

const handleDbErrors = (err, message) => {
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    // eslint-disable-next-line no-param-reassign
    err.statusCode = 400;
    // eslint-disable-next-line no-param-reassign
    err.message = message;
    return err;
  }
  return err;
};

module.exports = {
  handleErrorConstructor,
  handleDbErrors,
};
