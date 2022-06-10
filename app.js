var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');


const { urlencoded } = require('express');
var bodyParser = require('body-parser'); 
var fs = require('fs');
var path = require('path');
require('dotenv/config');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/api/users');
var productsRouter = require('./routes/api/products');
var config=require("config");

var session = require('express-session');
var sessionAuth=require('./middlewares/sessionAuth');
var app = express();

app.use(session({
  secret:'dummytext',
  resave:false,
  saveUninitialized:true,
  cookie:{maxAge:60000}
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(sessionAuth)




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));





app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/', usersRouter);
app.use(express.json());
app.use(urlencoded({extended: true}));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

mongoose.connect((config.get("db")),
{useNewUrlParser:true}).then(()=>console.log("Connected to mongodb..."))
.catch((error)=>console.log(error.message));



module.exports = app;
