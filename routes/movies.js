const router = require('express').Router();
const { celebrate, Joi, Segments } = require('celebrate');

const {
  createMovie,
  deleteMovie,
  getMovies,
} = require('../controllers/movies');

const urlValidationPattern = /^(https?:\/\/)(www\.)?([a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]+#?)$/;

const createMovieSchema = celebrate({
  [Segments.BODY]: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(urlValidationPattern).required(),
    trailerLink: Joi.string().pattern(urlValidationPattern).required(),
    thumbnail: Joi.string().pattern(urlValidationPattern).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

router.get('/', getMovies);
router.post('/', createMovieSchema, createMovie);
router.delete('/_id', deleteMovie);

module.exports = router;
