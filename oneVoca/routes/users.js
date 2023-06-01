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

    // 로그인한 사용자의 id 와 일치하는 member_id 속성을 가진 행을 user_folder 에서 불러온다 (사용자가 가지고 있는 모든 폴더를 불러온다)
    const folderQuery = 'SELECT * FROM user_folder WHERE member_id = ?';
    const [folderRows] = await connection.promise().query(folderQuery, [uid]);
    for(let i = 0; i < folderRows.length; i++){
      folderNames.push(folderRows[i].folder_name);
    }

    // 사용자의 폴더에 있는 검색제목들을 가져온다 (사용자가 가지고 있는 모든 제목을 가져온다)
    const titleQuery = 'SELECT * FROM result_title WHERE folder_id = ?';
    for(let i = 0; i < folderRows.length; i++){
      const [titleRows] = await connection.promise().query(titleQuery, [folderRows[i].folder_id]);
      titleRowsResult.push(titleRows);

    }

    // 사용자의 검색 제목과 일치하는 검색 단어들을 가져온다 (사용자가 가지고 있는모든 단어 검색 결과를 가져온다)
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


    // 사용자 폴더별 단어 배열 => [{word: '단어'}] 형식의 결과를 반환한다 
    let folderWordResult = [];
    const folderWordQuery = 'SELECT word FROM result WHERE folder_id = ?';
    for(let i = 0; i < folderRows.length; i++){ // i = 사용자가 가지고 있는 폴더의 개수
      let folderIds = folderRows[i].folder_id;
      const [folderWords] = await connection.promise().query(folderWordQuery, [folderIds]);
      folderWordResult.push(folderWords);
    }


    // 단어 검색 결과에서 단어만 모아서 배열을 만든다 (각 폴더에 있는 모든 단어 검색결과의 단어 모음) => [['단어1', '단어2'], ['단어3'], []] 형식의 결과를 반환한다
    let duplicatedWords = [];
    for(let i = 0; i < folderWordResult.length; i++){ // i = 사용자가 가지고 있는 폴더의 개수
      let arr = [];
      for(let j = 0; j < folderWordResult[i].length; j++){ // j = 폴더각 있는 단어의 개수
        arr.push(folderWordResult[i][j].word);
      }
      duplicatedWords.push(arr);
    }

    // 한 폴더의 모든 단어에서 각 단어가 몇번이나 중복되는지 카운트해서 저장하는 배열을 만든다 => [ [{word: '단어1', count: 3}, {word: '단어2', count:1}], [] ] 형식의 결과를 반환한다 
    let dupWords = [];
    // 배열에 단어의 중복횟수와 내림차순으로 정리된 데이터를 저장한다    
    for (let i = 0; i < duplicatedWords.length; i++) {
      // 단어가 중복된 횟수를 카운트한다
      let countMap = {};
      duplicatedWords[i].forEach((x) => {
        countMap[x] = (countMap[x] || 0) + 1;
      });
      // 내림차순으로 정리하기 위해 객체인 countMap 을 배열로 변환한다
      let arr = Object.entries(countMap).map(([word, count]) => ({ word, count }));
      // 내림차순으로 정렬
      arr.sort((a, b) => b.count - a.count);
      dupWords.push(arr);
    }

    // 사용자에의 db 데이터와 함께 users 페이지로 응답
    res.render('users', {
      folderRows: folderRows,
      titleRowsResult: titleRowsResult,
      wordRowsResult: wordRowsResult,
      dupWords: dupWords
    });

  } catch (err){
    console.error(err);
    res.status(500).send('database error');
  }

});

module.exports = router;
