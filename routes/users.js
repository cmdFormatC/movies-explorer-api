const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  logOut,
  getCurrentUser,
  updateUser,
} = require('../controllers/users');

const updateUserSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string(),
  }).or('name', 'email'),
});

router.get('/logout', logOut);
router.get('/me', getCurrentUser);
router.patch('/me', updateUserSchema, updateUser);

module.exports = router;
