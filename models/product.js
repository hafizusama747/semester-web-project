var mongoose = require('mongoose');
const Joi=require("@hapi/joi");
  
var productSchema = new mongoose.Schema({
    name: String,
    desc: String,
    price:String,
    img:
    {
        type:String,
        default:'placeholer.png',
    }
});
  
function validate(data){
    const schema=Joi.object({
        name:Joi.string().min(3).max(12).required(),
        desc:Joi.string().min(5).required(),
        price:Joi.number().min(0).required(),
        img:Joi.string().min(5).required(),
    });
    return schema.validate(data,{abortEarly:false});
}
  
var Product=mongoose.model("Product",productSchema);
module.exports.validate=validate;

module.exports.Product=Product;