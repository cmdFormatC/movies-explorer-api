const Movie = require('../models/movies');

const { handleErrorConstructor, handleDbErrors } = require('../utils/handleErrorTools');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return next(handleErrorConstructor(404, 'Фильм не найден'));
    }

    if (req.user._id !== movie.owner.toString()) {
      return next(handleErrorConstructor(403, 'Нельзя удалить не свой Фильм'));
    }
    await Movie.findByIdAndDelete(req.params.id);
    res.send(movie);
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

const createMovie = async (req, res, next) => {
  const requiredFields = ['country', 'director', 'duration', 'year', 'description', 'image', 'trailer', 'nameRU', 'nameEN', 'thumbnail', 'movieId'];

  const hasAllRequiredFields = requiredFields.every(field => req.body[field]);

  if (!hasAllRequiredFields) {
    return next(handleErrorConstructor(400, 'Некорректные данные'));
  }

  try {
    const movieFields = {
      owner: req.user._id,
    };
    requiredFields.forEach(elem => {
      movieFields.elem = req.body[elem];
    });
    const movie = await Movie.create(movieFields);
    res.send(movie);
  } catch (err) {
    return next(handleDbErrors(err, 'Некорректный запрос'));
  }
};

module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
};
