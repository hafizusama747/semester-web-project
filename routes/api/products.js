var express = require('express');
var router = express.Router();
var {Product,validate}= require("../../models/product")
var checkSessionAuth=require("../../middlewares/checkSessionAuth")
const multer=require('multer');
const validateTheProduct=require("../../middlewares/validateProduct")
var auth=require("../../middlewares/auth");
var admin=require("../../middlewares/admin");

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

//api for all products
router.get('/api', async function(req, res, next) {
  let page=Number(req.query.page?req.query.page:1);
  let perPage= Number(req.query.perPage?req.query.perPage:10);
  let skipRecords=(perPage*(page-1));


  let products=await Product.find().skip(skipRecords).limit(perPage);
  res.send(products)
});

//api for single product
router.get('/api/:id', async function(req, res, next) {
  try{
    let product=await Product.findById(req.params.id);
    if(!product) 
    return res.status(400).send("Product with given ID is not present")
    return res.send(product)
  }catch (err){
    res.send("Invalid ID")
    return res.status(400).send("Product with given ID is not present")
  }

});

//api to update a product
router.put("/api/:id", async function(req, res, next) {
  let product=await Product.findById(req.params.id);
  product.name=req.body.name,
  product.desc=req.body.desc,
  product.price=req.body.price,
  product.img=req.body.img,
  await product.save();

  res.send(product)
});

//api to delete a product
router.delete("/api/:id", async function(req, res, next) {
  let product=await Product.findByIdAndDelete(req.params.id);

  res.send(product)
});

//api to add a new product
router.post('/api', async function(req, res, next) {

  let product=new Product({
    name:req.body.name,
    desc:req.body.desc,
    price:req.body.price,
    img:req.body.img,
  })

  try{
      await product.save();
  }catch{
      console.log(error);
  }
  
  res.send(product)

  return
});




router.get('/', async function(req, res, next) {
    let products=await Product.find();
    res.render("products/list",{products:products})
});


router.post('/search', async function(req, res, next) {
  let products=await Product.find({name:req.body.name});
res.render("products/list",{products:products})
});


router.get('/add',checkSessionAuth, async function(req, res, next) {
res.render("products/add")
});


router.post('/add',upload.single('image'), async function(req, res, next) {

  console.log(req.file);
  let product=new Product({
    name:req.body.title,
    desc:req.body.description,
    price:req.body.price,
    img:req.file.filename,
  })

  try{
      await product.save();
  }catch{
      console.log(error);
  }
  
  res.redirect("/products")
});


router.get("/delete/:id", async function(req, res, next) {
  let product=await Product.findByIdAndDelete(req.params.id);
  res.redirect("/products")
});


router.get("/edit/:id", async function(req, res, next) {
  let product=await Product.findById(req.params.id);
  res.render("products/edit",{product})
});


router.get("/cart/:id", async function(req, res, next) {
  let product=await Product.findById(req.params.id);
  let cart=[];
  if(req.cookies.cart) cart=req.cookies.cart;
  cart.push(product)
  res.cookie("cart",cart);

  res.redirect("/products")
});

router.get("/cart/remove/:id", async function(req, res, next) {
 
  if(req.cookies.cart) cart=req.cookies.cart;
  cart.splice(cart.findIndex(c=>c._id==req.params.id),1)
  res.cookie("cart",cart);

  res.redirect("/cart")
});




router.post("/edit/:id",upload.single('image'), async function(req, res, next) {
  let product=await Product.findById(req.params.id);
  product.name=req.body.title,
  product.desc=req.body.description,
  product.price=req.body.price,
  product.img=req.file.filename,


  await product.save();

  res.redirect("/products")
});



module.exports = router;