var express = require('express');
const PDFDocument = require('pdfkit');

const bodyParser = require("body-parser");

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

/* post home page. */
router.post('/', async function(req, res) {
    
    const wordsList = JSON.parse(req.body.wordsList);

    const doc = new PDFDocument;
    doc.pipe(res); // 파일을 response 객체에 바로 전송

    // 사용자가 입력한 제목을 pdf 에 출력한다
    const filename = wordsList[2];
    doc.fontSize(14).text(filename, {
        align: 'center'
    });

    // response 로 pdf 파일을 바로 다운로드 받을 수 있게 response header 를 설정한다.
    res.setHeader('Content-disposition', `attachment; filename=${filename}`); // 사용자가 입력한 제목으로 다운로드될 pdf 의 파일명을 설정한다
    res.setHeader('Content-type', 'application/pdf');

    let resultList = await searchWords(wordsList);

    for(let i = 0; i < resultList.length; i++){ // pdf 제목을 제외한 단어 부분을 출력한다
        doc.moveDown();

        // 단어 출력
        doc.font('Helvetica-Bold').fontSize(12).text(resultList[i].word);
        doc.moveDown();

        let meaningsLen = resultList[i].meanings.length; // 한 단어가 가지고 있는 품사의 개수

        for(let j = 0; j < meaningsLen; j++) {
        
                let partOfSpeech = resultList[i].meanings[j].partOfSpeech; // 품사

                // 품사를 출력한다
                doc.font('Times-Italic').fontSize(10).text(partOfSpeech); 
                doc.moveDown();
                let defsLen = resultList[i].meanings[j].definitions.length; // 한 품사가 가지고 있는 뜻의 개수
        
                if(defsLen > 3) { // 하나의 품사에 뜻이 3개 이상이면 최대 3개만 보여준다
                    defsLen = 3;
                }
        
                for(let k = 0; k < defsLen; k++) { // 한 품사가 가지고 있는 뜻의 개수(최대 3개)만큼 뜻과 예문을 출력한다
        
                    let definition = resultList[i].meanings[j].definitions[k].definition; // 단어의 뜻
                    let example = resultList[i].meanings[j].definitions[k].example; // 단어의 예문
        
                    // 한 품사가 가지고 있는 뜻과 예문을 출력한다
                    if(wordsList[0] == false){ // hideDef 옵션이 꺼져있을 때 출력
                        doc.font('Helvetica').fontSize(12).text(`${k+1}. ` + definition);
                        doc.moveDown(0.5);
                    }
                    if(wordsList[1] == false){ // hideEx 옵션이 꺼져있을 때 출력
                        doc.fontSize(10).text(example, {
                            indent: 15
                        });
                        doc.moveDown(2);
                    }

                }
            }
        }

    // pdf 문서 생성 완료 후 마무리 처리
    doc.end(); 

});

// 단어를 검색기 위해 사전 api 를 호출해서 결과를 받는 함수
async function searchWords(wordsList){
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    let resultList = new Array();
    // 전달받은 wordsList 안에 있는 단어들을 for 문으로 반복해서 api 요청해서 데이터를 받아온다
    for (let [index, word] of wordsList.entries()){ 
        if(index >= 3){ // 사용자가 입력한 title 을 제외하고 그 이후의 단어들을 검색한다

            if(word == ""){ // 사용자가 삭제한 단어는 건너 뛴다
                continue;
            }

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
