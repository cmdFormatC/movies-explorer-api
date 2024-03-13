const router = require('express').Router();

const {
  createUser, login,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

router.post('/signin', login);
router.post('/signup', createUser);

router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));
