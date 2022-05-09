const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse.js');
const User = require('../models/User.js');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;
//  console.log("cookie",req.cookies);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
   // console.log("s",token);
    // Set token from cookie
  }
  else if (req.cookies.token) {
    token = req.cookies.token;
  //  console.log(token);
  }

  // Make sure token exists
  if (!token) {
   // console.log("hi");
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    if(!req.user){
        return next(new ErrorResponse('No User Found', 404));
    }

    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

