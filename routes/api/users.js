var express = require('express');
var router = express.Router();
var {User}= require("../../models/user")
const validateUserRegistration=require("../../middlewares/validateUser")
const multer=require('multer');
var bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const config=require("config");
const { token } = require('morgan');

//define storage for the images

const storage = multer.diskStorage({

  //destination for files
  destination:function(req, file, callback){
    callback(null,'./public/uploads/images');
  },


  //add back the extension

  filename:function(req, file, callback){
    callback(null,Date.now()+file.originalname);
  }

});

//upload paramters
const upload=multer({
  storage:storage,
  limits:{
    fieldSize: 1024*1024*3,
  }
})


/* GET home page. */
router.get('/register', function(req, res, next) {
  res.render("users/register");
});

router.get('/login', function(req, res, next) {
  res.render("users/login");
});

router.get('/logout', function(req, res, next) {
  req.session.user=null;
  res.redirect("/login")
});

router.post('/login',async function(req, res, next) {

  const body = req.body;
  let user= await User.findOne({email:req.body.email})
  if(!user) return res.redirect("/login")
  if (user) {
    // check user password with hashed password stored in the database
    const validPassword = await bcrypt.compare(body.password, user.password);
    if (validPassword) {
   
      req.session.user=user;
    } else {
      return res.status(400).send("Invalid Password")
    }
  } else {
    return res.status(400).send("User Does not exists")
  }
 
  let token=jwt.sign({_id:user.id,name:user.name},config.get("jwtprivatekey"))
 
  return res.redirect("/")
  
});

router.get('/profile',async function(req, res, next) {
  
  res.render("users/profile");
});

router.get('/profile/settings',async function(req, res, next) {
  
  res.render("users/settings");
});

router.post('/profile/settings',upload.single('image'),async function(req, res, next) {
  let user = await User.findOne({email:req.body.email})
  if(!user) return res.status(400).send("Invalid Email")

    user.name=req.body.name;
    user.email=req.body.email;
    user.password=req.body.password;
    let salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);


    user.img=req.file.filename,


    await user.save();

  
  res.redirect("/")
});



router.post('/register',upload.single('image'),async function(req, res, next) {
  let user = await User.findOne({email:req.body.email})
  if(user) return res.status(400).send("User with Given Email Already exists")

    user=new User();
    user.name=req.body.name;
    user.email=req.body.email;
    user.password=req.body.password;
    let salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password,salt);


    user.img=req.file.filename,


    await user.save();

  
  res.redirect("/")
});


module.exports = router;
