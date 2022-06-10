function checkSessionAuth(req,res,next){
   if(req.session.user) next();
   else return res.redirect("/login");
    
}
module.exports = checkSessionAuth;