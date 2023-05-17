var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

// /register/cancel 로 get 요청이 들어오면 / (메인 페이지)로 리다이렉트한다
router.get('/cancel', function(req, res, next){
  res.redirect('/');
})

module.exports = router;
