var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var customValidators = require('./modules/custom-validators');

var routes = require('./routes/index');
var users = require('./routes/users');
var tools = require('./routes/tools');
var bookings = require('./routes/bookings');
var invoices = require('./routes/freshbooks_invoices');
var business = require('./routes/business');
var admin = require('./routes/admin');
var login = require('./routes/login');
var refactor = require('./routes/bookings_refactor');
var issues = require('./routes/issue_reporting');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


var expressJwt = require('express-jwt');
app.use('/admin/*', expressJwt({secret: process.env.SECRET}), function(req,res,next){
  if(req.user.accountType === 'admin'){
    next();
  } else {
    res.status(401).send('Not Authorized')
  }
});
app.use('/business/*', expressJwt({secret: process.env.SECRET}), function(req,res,next){
  if(req.user.accountType === 'business'){
    next();
  } else {
    res.status(401).send('Not Authorized')
  }
});
app.use('/private/*', expressJwt({secret: process.env.SECRET}));
app.use('/tools/*', expressJwt({secret: process.env.SECRET}));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.send(401, 'invalid token...');
  }
});

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator({
  customValidators: customValidators
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/private', express.static(path.join(__dirname, 'private')));
app.use('/business', express.static(path.join(__dirname, 'business')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

var dbURI = 'mongodb://localhost:27017/teamnordeast';
mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
    console.log('Mongoose default connection is open: ', dbURI);
});
mongoose.connection.on('error', function(){
    console.log('Mongoose connection failed with ', err);
});

app.use('/', routes);
app.use('/users', users);
app.use('/business', business);
app.use('/admin', admin);
app.use('/tools', tools);
app.use('/bookings', bookings);
app.use('/freshbooks_invoices',invoices);
app.use('/login', login);
app.use('/bookings_refactor', refactor);
app.use('/issues', issues);
app.use('/*', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
