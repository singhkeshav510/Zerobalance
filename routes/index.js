const router = require("express").Router();

const authRoutes = require('./auth-routes')
//const userRoutes = require('./user-routes')
const movieRoutes = require('./movie-routes')

router.use('/auth', authRoutes);
//router.use('/user', userRoutes);
router.use('/movie', movieRoutes);

module.exports = router;


