var express = require('express');
var router = express.Router();
const crypto = require('crypto');

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

  // 보안을 위해 추가할 salt 값을 생성한다
  const salt = crypto.randomBytes(64);

  // 사용자의 비밀번호를 해시함수로 암호화한다
  crypto.pbkdf2(userPw, salt, 163023, 64, 'sha512', (err, key) => {
    const hashedPw = key.toString('base64');

    // 회원가입 정보를 DB에 저장하는 쿼리 실행
    const query = 'INSERT INTO user (user_id, user_pw, user_email, salt) VALUES (?, ?, ?, ?)';
    connection.query(query, [userId, hashedPw, userEmail, salt], (err, result) => {
      if(err) {
        console.error('Error inserting user: ', err);
        res.status(500).send('Failed to register user');
        return;
      } 

      console.log('User registered successfully: ');

      let newMemberId = result.insertId;

      // 회원가입과 동시에 새로운 사용자에게 기본폴더를 생성해준다
      const folderQuery = 'INSERT INTO user_folder (folder_name, member_id) VALUES (?, ?)';
      connection.query(folderQuery, ['normal', newMemberId], (err, result) => {
        if (err) {
          console.error('Error creating default folder:', err);
          res.status(500).send('Failed to create normal folder');
          return;
        }

        res.send("<script>alert('성공적으로 회원가입되었습니다.');location.href='/';</script>");

      });
    }); 

  });

});

// /register/cancel 로 get 요청이 들어오면 / (메인 페이지)로 리다이렉트한다
router.get('/cancel', function(req, res, next){
  res.redirect('/');
});

module.exports = router;
