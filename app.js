var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport');
var session = require('express-session');


var indexRouter = require('./routes/index');
var api = require('./routes/api');
var auth = require('./routes/auth')
var app = express();    //express是个框架

// view engine setup
app.set('views', path.join(__dirname, 'views')); // _dirname 表示当前文件路径
app.set('view engine', 'ejs');  //模板引擎是ejs

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //把pubic加在下面形成新的目录

//使用session中间件
app.use(session({secret: 'sessionsecret'}));//这里secret里可以随便写
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/api', api);  //所有以api开头的请求，都交给api去处理
app.use('/auth', auth);//加了一个auth的路由

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
