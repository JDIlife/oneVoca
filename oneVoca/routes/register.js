var express = require('express');
var router = express.Router();

// db 연결 객체를 불러온다
const connection = require('../db');

// 회원가입 홈페이지 요청
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});

// 회원가입 폼 제출
router.post('/', (req, res) => {
  const {userId, userPw, userPwConfirm, userEmail}  = req.body;

  // 비밀번호 입력 확인
  if (userPw !== userPwConfirm){
    res.status(400).send('Passwords confirmation does not match');
    return;
  }

  // 회원가입 정보를 DB에 저장하는 쿼리 실행
  const query = 'INSERT INTO user (user_id, user_pw, user_email) VALUES (?, ?, ?)';
  connection.query(query, [userId, userPw, userEmail], (err, result) => {
    if(err) {
      console.error('Error inserting user: ', err);
      res.status(500).send('Failed to register user');
      return;
    } else {
      console.log('User registered successfully: ', result);
      res.status(200).send('Registration successful');
    }
  });

});

// /register/cancel 로 get 요청이 들어오면 / (메인 페이지)로 리다이렉트한다
router.get('/cancel', function(req, res, next){
  res.redirect('/');
});

module.exports = router;
