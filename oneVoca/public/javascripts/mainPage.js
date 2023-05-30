// jsPDF 설정
window.jsPDF = window.jspdf.jsPDF;

// ========== UI 요소 지정 ========== //
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

const input = document.getElementById("wordInput");
const wordsInputBtn = document.getElementById("btn");
const searchBtn = document.getElementById("searchBtn");
const titleInput = document.getElementById("titleInput");
const pdfDownloadBtn = document.getElementById("pdfDownloadBtn");

const wordsArea = document.getElementById("wordsArea");
let wordsTable = document.getElementById("wordsTable");
let tbody = wordsTable.children[1];

let dropdownBtn = document.getElementById('dropdownBtn');

// 드롭다운 메뉴를 클릭하면 해당 드롭다운 메뉴의 텍스트로 드롭다운 버튼의 텍스트가 변경된다
document.addEventListener('DOMContentLoaded', function() {
    let dropdownItems = document.getElementsByClassName('dropdown-item');
  
    for (var i = 0; i < dropdownItems.length; i++) {
      dropdownItems[i].addEventListener('click', function(event) {
        event.preventDefault();
  
        var selectedOption = this.innerText; // 선택된 옵션의 텍스트를 가져온다
        
  
        // 드롭다운버튼의 텍스트를 선택된 옵션의 텍스트로 변경한다
        dropdownBtn.innerText = selectedOption;
      });
    }
  });



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

searchBtn.addEventListener('click', async () => {

    let resultList = await searchWords(wordsList);

    // form 생성
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/store-result";

    // hidden input 추가
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "wordsList";


    // wordsList 배열의 두 번째 요소로 사용자가 titleInput 에 입력한 제목을 넣어준다
    // if(titleInput.innerText.trim() == ''){
    //     const date = new Date();
        
    //     let year = date.toLocaleDateString('default', {year: "numeric"});
    //     let month = date.toLocaleDateString('default', {month: "2-digit"});
    //     let day = date.toLocaleDateString('default', {day: "2-digit"});
    //     let hour = date.toLocaleDateString('default', {hour: "2-digit"});
    //     let minute = date.toLocaleDateString('default', {minute: "2-digit"});

    //     let today = year + "/" + month + "/" + day + "/" + " " + hour + ":"+ minute;

    //     console.log(today);
    //     wordsList.unshift(today);
    // } 
    wordsList.unshift(titleInput.value);
    // wordsList 배열의 첫 번째 요소로 사용자가 지정한 폴더의 이름을 넣어준다
    wordsList.unshift(dropdownBtn.innerText);

    input.value = JSON.stringify(wordsList);

    // form 에 input 추가
    form.appendChild(input);

    // form 을 body에 추가하고 submit
    document.body.appendChild(form);
    form.submit();

    console.log(wordsList)

    titleInput.value = null;
 

    // 입력된 단어 테이블 초기화
    wordsList = [];

    // tbody 의 모든 행 삭제
    let trs = document.querySelectorAll("tbody tr");
    for(let i = 0; i < trs.length; i++){
        trs[i].remove();
    }
    tr = document.createElement("tr");

});

 // 단어를 검색기 위해 사전 api 를 호출해서 결과를 받는 함수
async function searchWords(wordsList){
    let url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
    // 사용자가 삭제한 단어는 배열에서 제외한다
    wordsList = wordsList.filter(word => word !== '');

    let resultList = new Array();
    // 전달받은 wordsList 안에 있는 단어들을 for 문으로 반복해서 api 요청해서 데이터를 받아온다
    for (let word of wordsList){
        const res = await fetch(url + word);
        const data = await res.json();
        if(data[0] == undefined){ // 만약 사용자가 오타를 냈거나, dictionary api 에 없는 단어를 검색했다면, resultList 에 추가하지 않고 건너뛴다
            continue;
        }
        resultList.push(data[0]);
    }
  
    return resultList;
 }

 // ============ pdf 다운로드 버튼 이벤트 설정 ============= //
pdfDownloadBtn.addEventListener('click', async () => {

    // form 생성
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/generate-pdf";

    // hidden input 추가
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "wordsList";


    // wordsList 배열의 첫 번째 요소로 사용자가 titleInput 에 입력한 제목을 넣어준다
    wordsList.unshift(titleInput.value);

    input.value = JSON.stringify(wordsList);

    // form 에 input 추가
    form.appendChild(input);

    // form 을 body에 추가하고 submit
    document.body.appendChild(form);
    form.submit();

    titleInput.value = null;
     
})