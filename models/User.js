const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },  
    password:{
        type:String,
        require:true
    },
    integral:{//积分
        type:String,
        default:500
    },
    role:{//权限
        type:String,
        default:"guest"
    },
})

module.exports = User = mongoose.model("users",UserSchema);