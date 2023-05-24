var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:userId', function(req, res, next) {
  const userId = req.session.userId;

  if(req.session.isLoggedIn){ // 로그인이 되어있다면 개인 페이지로 응답
    res.render('users', {userId: userId})
  } else { // 로그인 상태가 아니라면 안내 메시지
    res.send("로그인을 먼저 진행해주세요");
  }
});

module.exports = router;
