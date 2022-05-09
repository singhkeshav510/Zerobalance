const mongoose = require("mongoose");

const userMovieHistorySchema = new mongoose.Schema({
    movieID:{
        type: mongoose.Schema.ObjectId,
        ref:'Movie'
    },
    userID:{
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    givenRating:{
        type:Number,
        min:[0,"Rating can't be less than 0"];
        max:[5,"Rating can't be greater than 5"];
    },
}
,{
    timestamps:true
});

module.exports = mongoose.model("UserMovieHistory",userMovieHistorySchema);