var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('client-sessions');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var allGatewaysRouter = require('./routes/allGateways')
authenticateRouter = require('./routes/authenticate');
groupsRouter = require('./routes/groups');
gatewayRouter = require('./routes/gateway')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authenticate', authenticateRouter);
app.use('/groups', groupsRouter);
app.use('/gateway', gatewayRouter)
app.use('/allGateways', allGatewaysRouter)

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

app.use(session({
  cookieName: 'session',
  secret: 'random_string',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

module.exports = app;
