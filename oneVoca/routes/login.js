var express = require('express');
var router = express.Router();

require('dotenv').config();

// db 연결 객체를 불러온다
const connection = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/', function(req, res, next) {
  const {userId, userPw}  = req.body;

// 로그인 기능
  connection.getConnection((err, connection) => {
    const query = 'SELECT * FROM user WHERE user_id = ?';
      connection.query(query, [userId], (err, result) => {
        if(err) {
          console.error('Error find user: ', err);
          res.status(500).send('Failed to find user');
          return;
        } else if(result.length == 0) { // 입력된 id를 가진 사용자가 없는 경우
          return res.send('해당 id를 가진 사용자를 찾을 수 없습니다');
        } else { // 해당 id를 가진 사용자가 존재하는 경우
          const user = result[0];

          if(userPw != user.user_pw){ // 비밀번호가 틀린 경우
            return res.send("비밀번호가 일치하지 않습니다");
          } else { // 비밀번호가 맞는 경우
            console.log(req.session);
            req.session.user = {
              id: user.user_id
            }
            res.send("로그인 성공!");
          }
        }
    })
  })
})

// 로그아웃 기능
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// /login/cancel 로 get 요청이 들어오면 / (메인 페이지)로 리다이렉트한다 {로그인을 취소한 경우}
router.get('/cancel', (req, res, next) => {
    res.redirect('/');
})

module.exports = router;
