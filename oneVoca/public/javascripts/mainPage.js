
// ========== UI 요소 지정 ========== //
const input = document.getElementById("wordInput");
const wordsInputBtn = document.getElementById("btn");
const searchBtn = document.getElementById("searchBtn");
const pdfDownloadBtn = document.getElementById("pdfDownloadBtn")

const wordsArea = document.getElementById("wordsArea");
let wordsTable = document.getElementById("wordsTable");
let tbody = wordsTable.children[1];


// ===================== 사용자에게 단어를 입력받아 테이블에 표현해주는 부분 ================== // 

let wordsList = [];
let tr = document.createElement("tr");

// 배열과 테이블에 단어를 추가하는 함수
let wordsInput = () => {
    wordsList.push(input.value);
    console.log(wordsList.length);

    let td = document.createElement("td");
    td.innerHTML = `${input.value}<button type="button" class="btn-close" aria-label="Close"></button>`;

    tr.appendChild(td);
    tbody.appendChild(tr);

    // 만약 단어를 추가할 단어가 5의 배수번째라면 tr에 추가하고, 새로운 tr을 만들고 그것을 tr에 대입해서 새로운 행을 추가한다 
    if(wordsList.length % 5 == 0){
        // tr.appendChild(td);
        tr = document.createElement("tr");
        console.log("add a row")
    }
    
    // 단어 삭제 버튼을 누르면 단어가 삭제되는 기능
    let deleteBtn = td.children[0];
    deleteBtn.addEventListener('click', (event)=>{
        
        let tdToDelete = event.target.parentNode;
        let wordToDelete = tdToDelete.textContent;

        // 배열에서 해당되는 단어를 삭제한다
        let index = wordsList.indexOf(wordToDelete);

        // wordsList 배열에서 해당하는 위치의 단어를 공백으로 바꾼다 
        // {나중에 삭제되는 단어를 공백이 아니라 특정 기호를 추가해서 변경한 다음, 사용자가 삭제를 취소하면 원래의 텍스트로 되돌리고, 아니라면 검색버튼 누를 때 해당 패턴을 가진 단어만 제외하고 검색하도록 추가할 수도 있다}
        wordsList.splice(index, 1, "")

        // 삭제하려는 td 의 내용을 빈 내용으로 만든다 (테이블 형식 유지)
        tdToDelete.innerHTML = ``
        console.log(wordsList);
    })

    // input 의 입력값을 비운다
    input.value = null;

}

// 단어 입력 input 창에서 Enter 를 입력하면 자동으로 단어가 추가된다
input.addEventListener("keypress", (event)=>{
    if(event.key === 'Enter'){
        wordsInput();
    }
});

// 단어 입력 버튼에 이벤트 설정
wordsInputBtn.addEventListener("click", wordsInput);


// ================== 검색 결과 버튼 이벤트 설정 =================== //

searchBtn.addEventListener('click', () => {

    searchWords(wordsList);

    // 입력된 단어 테이블 초기화
    wordsList = [];

    // tbody 의 모든 행 삭제
    let trs = document.querySelectorAll("tbody tr");
    for(let i = 0; i < trs.length; i++){
        trs[i].remove();
    }
    tr = document.createElement("tr");

});

async function searchWords(wordsList){
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

    // 전달받은 wordsList 안에 있는 단어들을 for 문으로 반복해서 api 요청해서 데이터를 받아온다
    for(let i = 0; i < wordsList.length; i++){
        fetch(url+wordsList[i])
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data)
            })
    }

 }

pdfDownloadBtn.addEventListener('click', () => {

})