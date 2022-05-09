const express = require('express');
const {
  login,
  logout,
  signin,
} = require('../controllers/auth.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllConfig)
  .post(addConfig);

router
  .route('/current')
  .get(getCurrentConfig)
  .post(updateCurrentConfig);

module.exports = router;
