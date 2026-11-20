require('dotenv').config();

let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const mongoose = require('mongoose');

let indexRouter = require('./routes/index');

// Connect to MongoDB Atlas
// Pattern from professor's CRUD Part-1/config/app.js, adapted for environment variable
if (!process.env.MONGODB_URI) {
  console.error('MongoDB: MONGODB_URI is not set. Create a .env file — see .env.example.');
} else {
  mongoose.connect(process.env.MONGODB_URI)
    .catch(err => console.error('MongoDB connection error:', err));
  let mongoDB = mongoose.connection;
  mongoDB.on('error', console.error.bind(console, 'MongoDB connection error:'));
  mongoDB.once('open', function() {
    console.log('Connected to MongoDB');
  });
}

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

module.exports = app;
