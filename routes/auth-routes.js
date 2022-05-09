const express = require('express');
const {
  login,
  logout,
  signin,
  getCurrentProfile,
} = require('../controllers/auth.controller');

const {protect} = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router
  .route('/login')
  .post(login)

router
  .route('/signin')
  .post(signin)

router
  .route('/logout')
  .get(protect,logout)

router
  .route('/me')
  .get(protect,getCurrentProfile)
module.exports = router;
