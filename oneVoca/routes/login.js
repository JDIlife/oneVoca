var express = require('express');
var router = express.Router();
const crypto = require('crypto');

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
    if (err) { // 연결에 실패했을 때
      console.error('Error connection to database: ', err);
      res.status(500).send('Failed to connect to database');
      return
    }

    const query = 'SELECT * FROM user WHERE user_id = ?';

    connection.query(query, [userId], (err, result) => {
      connection.release();

      if(err){
        console.error('Error executing query: ', err);
        res.status(500).send('Failed to execute query');
        return;
      }

      // 해당하는 id 가 없는 경우
      if(result.length === 0){
        // 사용자에게 alert 를 띄워주고 메인 페이지로 돌아온다
        return res.render('alert', {error: "해당 id를 가진 사용자를 찾을 수 없습니다"});
      }

      // 해당하는 id 가 있는 경우
      const user = result[0];

      // db에 저장되어있는 사용자 아이디에 맞는 salt 를 불러온다
      const salt = user.salt;

      // 사용자가 입력한 비밀번호+salt 를 해싱한 다음에 db에 있는 해싱된 비밀번호와 일치하면 로그인, 그렇지 않다면 로그인시키지 않는다
      crypto.pbkdf2(userPw, salt, 163023, 64, 'sha512', (err, key) => {
        const hashedPw = key.toString('base64');

        if(hashedPw !== user.user_pw){
          return res.render('alert', {error: "비밀번호가 일치하지 않습니다"});
        }

        console.log('로그인 성공!');

        // 로그인 상태에 대한 세션 쿠키를 설정한다
        req.session.uid = user.id;
        req.session.userId = user.user_id;
        req.session.isLoggedIn = true;
        req.session.save(() => {
          res.redirect('/')
        }); 
      });

    });
  });
});

// 로그아웃 기능
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// /login/cancel 로 get 요청이 들어오면 / (메인 페이지)로 리다이렉트한다 {로그인을 취소한 경우}
router.get('/cancel', (req, res, next) => {
    req.session.destroy();
    res.redirect('/');
})

module.exports = router;
