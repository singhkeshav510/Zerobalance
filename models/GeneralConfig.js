const mongoose = require("mongoose");

const generalConfigSchema = new mongoose.Schema({
    configName:{
        type:String,
        min:[1,"Config name can't be of length as 0"];
    },
    lockingTime:{
        type:Number,
        default:30
    },
    lockingUnit:{
        type:String,
        default:"MIN",
        enum:["MIN","HOUR","SEC","DAY","WEEK","MONTH","YEAR"],
    },
    current:{
        type:Boolean,
        default:false
    },
    maxAttempt: {
        type:Number,
        default:4,
        min:[0,"This value can't be less than 0"]
    }
},
{
    timestamps:true
});

module.exports = mongoose.model("GeneralConfig",generalConfigSchema);
