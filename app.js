const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const { handleError } = require('./middlewares/handleError');

const { limiter } = require('./utils/rateLimiter');

const { handleErrorConstructor } = require('./utils/handleErrorTools');

const { PORT = 3000, BASE_PATH = 'http://localhost:' } = process.env;
const { DB_LINK } = process.env.NODE_ENV === 'production' ? process.env.DB_LINK : 'mongodb://localhost:27017/bitfilmsdb';
const app = express();

app.use(cors());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_LINK);

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use(require('./routes/index'));

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
