var express = require('express');
var router = express.Router();

/// db 연결 객체를 불러온다
const connection = require('../db');

/* GET users listing. */
router.get('/:userId', async function(req, res, next) {
  const userId = req.session.userId;
  const uid = req.session.uid;

  if(req.session.isLoggedIn == undefined){
    res.render('alert', {error: '로그인을 먼저 진행해주세요'});
  }

  // 사용자의 db 정보를 담아서 전달하는데 사용될 배열
  let folderNames = [];
  let titleRowsResult = [];
  let wordRowsResult = [];

  try{

    // 로그인한 사용자의 id 와 일치하는 member_id 속성을 가진 행을 user_folder 에서 불러온다
    const folderQuery = 'SELECT * FROM user_folder WHERE member_id = ?';
    const [folderRows] = await connection.promise().query(folderQuery, [uid]);
    for(let i = 0; i < folderRows.length; i++){
      folderNames.push(folderRows[i].folder_name);
    }

    // 사용자의 폴더에 있는 검색제목들을 가져온다
    const titleQuery = 'SELECT * FROM result_title WHERE folder_id = ?';
    for(let i = 0; i < folderRows.length; i++){
      const [titleRows] = await connection.promise().query(titleQuery, [folderRows[i].folder_id]);
      titleRowsResult.push(titleRows);

    }

    // 사용자의 검색 제목과 일치하는 검색 단어들을 가져온다
    const wordQuery = 'SELECT * FROM result WHERE title_id = ?';
    for(let i = 0; i < titleRowsResult.length; i++){
      for(let j = 0; j < titleRowsResult[i].length; j++){
        const [wordRows] = await connection.promise().query(wordQuery, [titleRowsResult[i][j].title_id]);

        // wordRowsResult 를 2차원 배열로 반환하기 위한 배열
        let wrapperRows = [];

        // db에 longText 형식으로 저장되어있는 result 를 값 사용을 편리하게 하기 위해 JSON 형식으로 변환하여 가져온다
        for(let k = 0; k < wordRows.length; k++){
          // result 를 JSON 으로 변환한 뒤 배열에 추가한다
          wordRows[k].result = JSON.parse(wordRows[k].result);
          wrapperRows.push(wordRows[k])
        }
        wordRowsResult.push(wrapperRows);
      }
    }

    // 사용자에의 db 데이터와 함께 users 페이지로 응답
    res.render('users', {
      folderRows: folderRows,
      titleRowsResult: titleRowsResult,
      wordRowsResult: wordRowsResult
    });

  } catch (err){
    console.error(err);
    res.status(500).send('database error');
  }

});

module.exports = router;
