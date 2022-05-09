const express = require('express');
const {
    getAllMovies,
    addMovie,
    getMovie,
    updateMovie,
    deleteMovie,
    getRating,
    giveRating,
    updateRating,
    deleteRating
} = require('../controllers/movie.controller');

const {protect} = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.use(protect);

router
  .route('/')
  .get(getAllMovies)
  .post(addMovie);

router
  .route('/:id')
  .get(getMovie)
  .put(updateMovie)
  .delete(deleteMovie);

  router
  .route('/rating/:id')
  .get(getRating)
  .post(giveRating)
  .delete(deleteRating);

  

module.exports = router;
