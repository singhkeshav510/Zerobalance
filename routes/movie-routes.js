const express = require('express');
const {
  login,
  logout,
  signin,
} = require('../controllers/auth.controller');

const router = express.Router({ mergeParams: true });

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
  .route('/rating')
  .get(getRating)
  .post(giveRating)
  .put(updateRating)
  .delete(deleteRating);

  

module.exports = router;
