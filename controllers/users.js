const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { handleErrorConstructor, handleDbErrors } = require('../utils/handleErrorTools');

const { JWT_SECRET = '6d64464cdced3e6c849a7f6825945f4b105e9f4ac0e0d7e1588ec4f0198f5a26' } = process.env;

const login = async (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'None',
          secure: true,
        })
        .end();
    })
    .catch(err => {
      // eslint-disable-next-line no-param-reassign
      err.statusCode = 401;
      return next(err);
    });
};

const logOut = async (req, res, next) => {
  try {
    res.clearCookie('jwt');
    res.send('Вы вышли из системы');
  } catch (err) {
    return next(err);
  }
};
const createUser = async (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create(
      {
        name, email, password: hashedPassword,
      },
    );
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    res.status(201).send(userData);
  } catch (err) {
    if (err.code === 11000) {
      return next(handleErrorConstructor(409, 'Указаный email уже зарегистрирован'));
    }
    return next(handleDbErrors(err, 'Переданы некорректные данные при создании пользователя'));
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(handleErrorConstructor(404, 'Пользователь по указанному _id не найден.'));
    }
    res.send(user);
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const updateUser = async (req, res, next) => {
  const update = {};
  if (req.body.name) update.name = req.body.name;
  if (req.body.email) update.email = req.body.email;

  if (Object.keys(update).length === 0) {
    return next(handleErrorConstructor(400, 'Переданы некорректные данные при обновлении профиля'));
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      update,
      { new: true, runValidators: true },
    );
    if (!user) {
      return next(handleErrorConstructor(404, 'Пользователь по указанному _id не найден.'));
    }
    res.send(user);
  } catch (err) {
    return next(handleDbErrors(err, 'Переданы некорректные данные при обновлении профиля'));
  }
};

module.exports = {
  login,
  logOut,
  createUser,
  getCurrentUser,
  updateUser,
};
