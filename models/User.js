const mongoose = require("mongoose");
const crypto = require('crypto');
const bcrypt= require("bcryptjs");
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:[1,"Username shouldn't be left empty"]
    },
    emailID:{
        type:String,
    },
    password:{
        type:String
    },
    avatar:{
        type:String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
          ]
    },
    age:{
        type:Number
    },
    attemptCount:{
        type:Number
    },
    favMovies:[{
        movie_id:{
            type: mongoose.Schema.ObjectId,
            ref:'Movie'
        },
        ratingGiven:{
            type:Number,
            min:[0,"Rating can't be less than 0"],
            max:[5,"Rating can't be greater than 5"],      
        }
    }
    ],
    lastLoginTime:{
        type:Date,
        default:Date.now()
    }
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if (!this.isModified('password')) {
      next();
    }
  
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
  
  // Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
};
  
  // Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User",userSchema);