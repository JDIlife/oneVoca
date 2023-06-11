var express = require('express');
var router = express.Router();

// db 연결 객체를 불러온다
const connection = require('../db');

// 사용자가 폴더를 저장하는 post 요청을 처리한다
router.post('/', async (req, res) => {

    const uid = req.session.uid;
    const folderName = req.body.folderName;

    if(uid == undefined){
        res.render('alert', {error: "로그인을 먼저해주시기 바랍니다"})
    }
 
    try{
        // 사용자가 입력한 폴더 이름 저장
        const query = 'INSERT INTO user_folder (member_id, folder_name) VALUES (?, ?)';
        const [queryRows] = await connection.promise().query(query, [uid, folderName]);

        const newFolderId = queryRows.insertId;
        
        res.send({newFolderId: newFolderId});

    } catch(err) {
        res.status(500);
    }
    
});

module.exports = router;
