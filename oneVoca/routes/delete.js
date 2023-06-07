var express = require('express');

const bodyParser = require("body-parser");

// db 연결 객체를 불러온다
const connection = require('../db');
const session = require('express-session');

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

/* post home page. */
// /delete/withdrawal 로 post 요청이 오면 회원 탈퇴를 수행한다
router.post('/withdrawal', async function(req, res) {
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

// 사용자가 선택한 폴더를 삭제한다
router.post('/folder', async function(req,res){

    const userId = req.session.userId;

    // form 으로 삭제할 폴더의 id 를 얻는다
    const folderId = JSON.parse(req.body.folderId);

    const deleteFolderQuery = 'DELETE FROM user_folder WHERE folder_id = ?';
    connection.query(deleteFolderQuery, [folderId]);

    res.redirect(`/users/${userId}`);

});

// 사용자가 선택한 검색결과 (제목+단어) 를 삭제한다
router.post('/title', async function(req,res){
    
    const userId = req.session.userId;

    // form 으로 삭제할 제목의 id 를 얻는다
    const titleId = JSON.parse(req.body.titleId);

    // 사용자 검색결과 제목 삭제
    const deleteTitleQuery = 'DELETE FROM result_title WHERE title_id = ?';
    connection.query(deleteTitleQuery, [titleId]);
    
    // 사용자 검색결과 단어 삭제
    const deleteWordQuery = 'DELETE FROM result WHERE title_id = ?';
    connection.query(deleteWordQuery, [titleId]);

    res.redirect(`/users/${userId}`);
});



module.exports = router;
