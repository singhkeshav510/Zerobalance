const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const Movie = require('../models/Movie');
const UserMovieHistory = require('../models/UserMovieHistory');

// @desc      Get All Movies or Search a Movie
// @route     GET /movie/
// @access    Private
exports.getAllMovies = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint fetches all Movies or searched ones'
    const {name}=req.query;
    let movies;
    if(name===undefined){
      movies = await Movie.find();
    }
    else {
      movies = await Movie.find({name:{$regex:name}});
    }
    res.status(200).json({data:movies,count:movies.length})
});

// @desc      Add a Movie
// @route     POST /movie/
// @access    Private
exports.addMovie = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint allows to add a Movie'
    const {name,year,thumbnail}=req.body;
    let newMovie = await Movie.create({name,year,thumbnail});
    res.status(201).json({data:newMovie})
});

// @desc      Get a Movie
// @route     GET /movie/:id
// @access    Private
exports.getMovie = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint allow to get a movie'
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        return next(new ErrorResponse("No Movie found with such details",404));
    }
    res.json({data:movie});
});

// @desc      Update a Movie
// @route     PUT /movie/:id
// @access    Public
exports.updateMovie = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint allows to update a movie'

});

// @desc      Delete a Movie
// @route     DELETE /movie/:id
// @access    Private
exports.deleteMovie = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint allows to delete a movie'
    await Movie.deleteOne({ _id:req.params.id});
    res.json({data:"Movie deleted"});
});

// @desc      Get a Rating
// @route     GET /movie/rating/:id
// @access    Private
exports.getRating = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint allows to get a rating for a movie'
    const movie = await Movie.findById(req.params.id);
    if(!movie){
        return next(new ErrorResponse("No Movie found with such details",404));
    }
    res.json({
        data:{
            rating:movie.avgRating,
            ratedCount:movie.ratedCount
        }
    })
});

// @desc      Give a Rating
// @route     POST /movie/rating/
// @access    Private
exports.giveRating = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint allows to give a rating to a movie'
  const movie = await Movie.findById(req.params.id);
  if(!movie){
    return next(new ErrorResponse("No Movie found with such details",404));
  }
  
  const {rating}=req.body;
  if(rating==undefined){
    return next(new ErrorResponse("Bad Request",400));
  }
  const relation = await UserMovieHistory.find({userID:req.user._id}).sort({"createdAt":-1});
  if(!relation||relation.length===0){
    movie.ratedCount += 1;
  //  console.log(1,(movie.ratedCount * movie.avgRating+rating)/movie.ratedCount);
    movie.avgRating=(movie.ratedCount * movie.avgRating+rating)/movie.ratedCount;
  }
  else {
   // console.log(movie.ratedCount,movie.avgRating,relation[0].givenRating)
   // console.log(2,(movie.ratedCount * movie.avgRating+rating-relation[0].givenRating)/movie.ratedCount);
    movie.avgRating=(movie.ratedCount * movie.avgRating+rating-relation[0].givenRating)/movie.ratedCount;
  }
  await movie.save();
  await UserMovieHistory.create({movieID:movie._id,userID:req.user._id,givenRating:rating});

  res.status(200).json({data:"Rated Movie"});
});


// @desc      Delete a Rating
// @route     DELETE /movie/rating/
// @access    Private
exports.deleteRating = asyncHandler(async (req, res, next) => {
    // #swagger.tags = ['Movie']
  // #swagger.description = ' This endpoint allows to derate a movie'
  const movie = await Movie.findById(req.params.id);
  if(!movie){
    return next(new ErrorResponse("No Movie found with such details",404));
  }
  
  const relation = await UserMovieHistory.find({userID:req.user._id}).sort({"createdAt":-1});
  if(!relation||relation.length===0){
   return  res.status(200).json({data:"UnRated Movie"});
  }
  else {
   // console.log(movie.ratedCount,movie.avgRating,relation[0].givenRating)
   // console.log(2,(movie.ratedCount * movie.avgRating+rating-relation[0].givenRating)/movie.ratedCount);
   movie.ratedCount-=1;
   if(movie.ratedCount==0){
     movie.avgRating=0;
   }
    else movie.avgRating=(movie.ratedCount * movie.avgRating-relation[0].givenRating)/movie.ratedCount;
  }
  await movie.save();
  await UserMovieHistory.create({movieID:movie._id,userID:req.user._id,givenRating:rating});

  res.status(200).json({data:"UnRated Movie"});
});

