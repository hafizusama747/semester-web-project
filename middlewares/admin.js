var {User}= require("../models/user")
function admin(req,res,next){
    if(req.user.type!="admin") 
    return res.status(403).send("You are not authorized")
    next();
    
 }
 module.exports = admin;