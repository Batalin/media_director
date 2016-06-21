var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');


var app = express();

var busboy = require("connect-busboy");





/*
var io = require('socket.io')(server);
var fs = require('fs');
var exec = require('child_process').exec;
var util = require('util');
*/
//var Files={};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



//var users = require('./routes/users');

require('./config/dbConnection')();

require('./config/passport')();

var routes = require('./routes/index');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(busboy());
app.use(express.static(path.join(__dirname, '/../public')));
app.use('/', routes);





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
