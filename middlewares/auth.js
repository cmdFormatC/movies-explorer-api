const jwt = require('jsonwebtoken');

const { handleErrorConstructor } = require('../utils/handleErrorTools');

const { JWT_SECRET = '6d64464cdced3e6c849a7f6825945f4b105e9f4ac0e0d7e1588ec4f0198f5a26' } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(handleErrorConstructor(401, 'Токен авторизации отсутсвует или не действителен'));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(handleErrorConstructor(401, 'Токен авторизации отсутсвует или не действителен'));
  }

  req.user = payload;

  next();
};
