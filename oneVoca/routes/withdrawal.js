var express = require('express');

const bodyParser = require("body-parser");

// db 연결 객체를 불러온다
const connection = require('../db');
const session = require('express-session');

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

/* post home page. */
router.post('/', async function(req, res) {
    const uid = req.session.uid;

    // 사용자의 데이터베이스에 저장된 모든 내용들을 삭제한다
    const deleteUserQuery = 'DELETE FROM user WHERE id = ?';
    connection.query(deleteUserQuery, [uid]);

    const deleteFolderQuery = 'DELETE FROM user_folder WHERE member_id = ?';
    connection.query(deleteFolderQuery, [uid]);

    const deleteTitleQuery = 'DELETE FROM result_title WHERE member_id = ?'
    connection.query(deleteTitleQuery, [uid]);
    
    const deleteResultQuery = 'DELETE FROM result WHERE member_id = ?'
    connection.query(deleteResultQuery, [uid]);


    // 사용자의 세션을 제거한다
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;
