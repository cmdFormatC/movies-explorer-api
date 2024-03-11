const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleError } = require('./middlewares/handleError');
const {
  createUser, login,
} = require('./controllers/users');
const auth = require('./middlewares/auth');
const { handleErrorConstructor } = require('./utils/handleErrorTools');

const { PORT = 3000, BASE_PATH = 'http://localhost:' } = process.env;
const app = express();

app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.use(errorLogger);

app.use(errors());

app.use('*', (req, res, next) => {
  next(handleErrorConstructor(404, 'Ресурс не найден'));
});

app.use(handleError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ссылка на сервер: ${BASE_PATH + PORT}`);
});
