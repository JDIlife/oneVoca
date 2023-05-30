var express = require('express');
var router = express.Router();

/// db 연결 객체를 불러온다
const connection = require('../db');

/* GET home page. */
router.get('/', async function(req, res, next) {
  const loggedIn = req.session.isLoggedIn || false;

  if(loggedIn == true){
    const uid = req.session.uid;
    const userId = req.session.userId;

    const query = 'SELECT * FROM user_folder WHERE member_id = ?';
    const [folderRows] = await connection.promise().query(query, [uid]);

    res.render('index', {loggedIn: loggedIn, folderRows: folderRows, userId: userId});
  } else {
    res.render('index', {loggedIn: loggedIn});
  }

});

module.exports = router;
