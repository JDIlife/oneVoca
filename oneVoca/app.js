// ========= 필요한 모듈 호출 ============ //
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');

// ========== 필요한 경로 호출 ============= //
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let pdfRouter = require('./routes/generate-pdf');
let registerRouter = require('./routes/register');
let loginRouter = require('./routes/login');
let storeRouter = require('./routes/store-result');


var app = express();

// ================== 미들웨어 설정 =============== //
const oneDay = 1000 * 60 * 60 * 24;
const sessionObj = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    secure: !true,
    maxAge: oneDay
  }
}
app.use(session(sessionObj));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();


app.listen(3000, function(){
  console.log('start on port 3000')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/generate-pdf', pdfRouter); // pdf 생성 post 라우팅 추가
app.use('/register', registerRouter); // 회원가입 라우팅 추가
app.use('/login', loginRouter); // 로그인 라우팅 추가
app.use('/store-result', storeRouter); // 검색 결과 저장 라우팅 추가


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
