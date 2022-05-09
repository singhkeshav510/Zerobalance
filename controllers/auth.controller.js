const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

// @desc      Login a User
// @route     POST /auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Auth']
  // #swagger.description = ' This endpoint logs in a user'
    let {emailID,password}=req.body;

    // Check for user
    let user = await User.findOne({ emailID }).select('+password');

    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch){
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    user.lastLoginTime=Date.now();
    await user.save();
    sendTokenResponse(user, 200, res);
});

// @desc      Signin a User
// @route     POST /auth/signin
// @access    Public
exports.signin = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Auth']
  // #swagger.description = ' This endpoint registers a user'
    let favMovies=[];
    let {emailID,password,name}=req.body;
    
    const user = await User.create({
        emailID,
        password,
        name,
        favMovies
      });
    sendTokenResponse(user, 200, res);
});


// @desc      Logout a User
// @route     POST /auth/register
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Auth']
  // #swagger.description = ' This endpoint logs out a user'
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure:true,
      sameSite : "None",
  });

  res.status(200)
  .json({success:true, data: "Successfully logged out" });
});

// @desc      Get Current Profile
// @route     GET /auth/me
// @access    Private
exports.getCurrentProfile = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Auth']
  // #swagger.description = ' This endpoint gets current logged in profile'
    let currentUser = req.user;
    let {emailID,age,name,lastLoginTime, avatar} = currentUser;

    res.status(200).json({
        emailID,age,name,lastLoginTime,avatar
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();
  
    const options = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure:process.env.NODE_ENV === 'production',
      sameSite : "None",
    };

    res
      .status(statusCode)
      .cookie('token', token, options)
      .json({
        success: true,
        data:{
            emailID:user.emailID,
            name:user.name,
            avatar:user.avatar,
            lastLoginTime:user.lastLoginTime,
            createdAt:user.createdAt,
            updatedAt:user.updatedAt
        }
      });
  };