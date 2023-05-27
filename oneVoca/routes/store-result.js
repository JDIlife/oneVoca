var express = require('express');

const bodyParser = require("body-parser");

// db 연결 객체를 불러온다
const connection = require('../db');

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

/* post home page. */
router.post('/', async function(req, res) {
    if(!req.session.isLoggedIn){ // 로그인하지 않고 접근한 경우
        console.log("비로그인 사용자입니다");
    }

    const uid = req.session.uid;
    
    const wordsList = JSON.parse(req.body.wordsList);

    // 사용자가 입력한 폴더
    const folderName = wordsList[0];
    
    // 사용자가 입력한 제목
    const fileName = wordsList[1];

    // 검색 결과를 받는다
    let resultList = await searchWords(wordsList);

    // 폴더의 이름에 맞는 폴더 id 를 가져온다
    const folderIdQuery = 'SELECT folder_id From user_folder WHERE folder_name = ? AND member_id = ?' // member id 가 가지고 있는 folder 만 가져와야됨
    connection.query(folderIdQuery, [folderName, uid], (err, result) => {
        if(err){
            res.status(500);
        }

        const folderId = result[0].folder_id;

        // 가져온 폴더 id 를 대체키로 title과 연결한다
        const titleQuery = 'INSERT INTO result_title (title_name, folder_id) VALUE (?, ?)'; 
        connection.query(titleQuery, [fileName, folderId], (err, result) => {
            if(err){
                res.status(500);
                return;
            }

            let titleId = result.insertId;

            // 단어 검색 결과를 result 테이블에 저장한다
            const wordsQuery = 'INSERT INTO result (title_id, word, result) VALUE (?, ?, ?) ';
            for(let i = 0; i < resultList.length; i++){
                let word = resultList[i].word;
                let resultData = JSON.stringify(resultList[i]); 
                console.log("resultList[i] type: ", typeof(resultList[i]));
                connection.query(wordsQuery, [titleId, word, resultData], (err, result) => {
                    if(err){
                        res.status(500);
                        return;
                    }

                });
            }
            res.redirect('/');
        });
    });

});

// 단어를 검색기 위해 사전 api 를 호출해서 결과를 받는 함수
async function searchWords(wordsList){
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    let resultList = new Array();
    // 전달받은 wordsList 안에 있는 단어들을 for 문으로 반복해서 api 요청해서 데이터를 받아온다
    for (let [index, word] of wordsList.entries()){
        if(index > 1){ // 사용자가 입력한 title 과 폴더이름을 제외하고 그 이후부터 검색한다

            // 사용자가 삭제한 단어는 배열에서 제외한다
            wordsList = wordsList.filter(word => word !== '');

            const res = await fetch(url + word);
            const data = await res.json();
            if(data[0] == undefined){ // 만약 사용자가 오타를 냈거나, dictionary api 에 없는 단어를 검색했다면, resultList 에 추가하지 않고 건너뛴다
                continue;
            }
            resultList.push(data[0]);
        }
    }
  
    return resultList;
 }

module.exports = router;
