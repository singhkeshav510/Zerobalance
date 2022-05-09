const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const User = require('../models/User');

// need checking
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
    let attTime= new Date(user.attemptedTime);
    let currentTime = new Date();

    let dif = (currentTime - attTime);
    dif = Math.round((dif/1000)/60);

    if(dif<=30&&user.isLocked==true){
        let v=30-dif;
        return next(new ErrorResponse(`Try after ${v} minutes`, 403));
    }
    else if(user.isLocked==true){
        user.isLocked=false;
    }
    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch){
        if(user.attemptCount==4){
           user.attemptCount=0;
           user.isLocked=true;
           user.attemptedTime=Date.now();
        }
        else {
            user.isLocked=false;
            user.attemptCount+=1;
            user.attemptedTime=Date.now();
        }
        await user.save();
        return next(new ErrorResponse('Invalid credentials', 401));
    }
    user.attemptCount=0;
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