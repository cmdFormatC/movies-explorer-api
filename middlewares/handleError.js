// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  if (!err.statusCode || !err.message) {
    res.status(500).send({ message: 'Ошибка сервера' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
}

module.exports = {
  handleError,
};
