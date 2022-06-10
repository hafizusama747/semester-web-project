var mongoose = require('mongoose');
const Joi=require("@hapi/joi");
  
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password:String,
    img:
    {
        type:String,
        default:'placeholer.png',
    },
    type:{
        type:String,
        default:'user',
    }
});
  
  
module.exports = new mongoose.model('User', userSchema);

function validateUser(data){
    const schema=Joi.object({
        name:Joi.string().min(3).max(12).required(),
        email:Joi.string().email().min(10).required(),
        password:Joi.string().min(8).required(),
        img:Joi.string().min(5).required(),
    });
    return schema.validate(data,{abortEarly:false});
}

function validateUserLogin(data){
    const schema=Joi.object({
        email:Joi.string().email().min(10).required(),
        password:Joi.string().min(8).required(),
    });
    return schema.validate(data,{abortEarly:false});
}
  
var User=mongoose.model("User",userSchema);
module.exports.validateUser=validateUser;//for signup
module.exports.validateUserLogin=validateUserLogin;//for login
module.exports.User=User;