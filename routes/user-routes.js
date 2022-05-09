const express = require('express');
const {
  login,
  logout,
  signin,
} = require('../controllers/auth.controller');

const router = express.Router({ mergeParams: true });

router
  .route('/me')
  .get(getMyProfile)
  .put(updateMyProfile)
  .delete(deleteMyProfile);


module.exports = router;
