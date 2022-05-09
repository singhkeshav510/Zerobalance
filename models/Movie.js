const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:[1,"Movie name shouldn't be left empty"]
    },
    ratedCount:{
        type:Number,
        default:0,
        required:true,
    },
    thumbnail:{
        type:String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            'Please use a valid URL with HTTP or HTTPS'
          ]
    },
    year:{
        type:Number,
        min:1800,
        max:3000,
        validate: {
            validator: function(val) {
                const d = new Date(Date.now());
                const year = d.getFullYear();
                return val<=year;
            },
            message: "Year can't be from future."
          }
    },
    avgRating:{
        type:Number,
        min:[0,"Rating can't be less than 0"],
        max:[5,"Rating can't be greater than 5"],
        default:0
    }
}
,{
    timestamps:true
});

// setting precision of movie rating before saving
movieSchema.pre('save', async function(next) {
    if (!this.isModified('avgRating')) {
      next();
    }
    
    this.avgRating = this.avgRating.toFixed(1);
});


module.exports = mongoose.model("Movie",movieSchema);