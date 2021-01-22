require('dotenv').config()
require('./db');
const express = require('express');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const favicon = require('serve-favicon');

const auth = require('./auth');
//ola teste
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(__dirname + '/node_modules/bootstrap-icons'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(auth.session)
app.use(cookieParser('O meu segredo'));
app.use(auth.passport.initialize());
app.use(auth.passport.session());

app.use(logger('dev'));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/home', require('./routes/home'));

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
