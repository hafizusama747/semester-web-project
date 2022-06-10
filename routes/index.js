var express = require('express');
var router = express.Router();
var User=require("../models/user")

/* GET home page. */
router.get('/', async function(req, res, next) {
  let user= await User.findOne({email:"dummy",password:"dummy"})
  res.render("index");
});

router.get('/cart', function(req, res, next) {
  let cart= req.cookies.cart;
  if(!cart) cart=[];
  let total=0;
    cart.forEach(element => {
      total+=+element.price;
    });
  res.render("cart",{cart:cart,total});
});

module.exports = router;
