// jsPDF 설정
window.jsPDF = window.jspdf.jsPDF;

// ========== UI 요소 지정 ========== //
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");

const input = document.getElementById("wordInput");
const wordsInputBtn = document.getElementById("word-btn");
const searchBtn = document.getElementById("searchBtn");
const titleInput = document.getElementById("titleInput");
const pdfDownloadBtn = document.getElementById("pdfDownloadBtn");

const wordsArea = document.getElementById("wordsArea");
let wordsTable = document.getElementById("wordsTable");
let tbody = wordsTable.children[1];

let dropdownBtn = document.getElementById('dropdownBtn');

let hideDef = document.getElementById('hide-def');
let hideEx = document.getElementById('hide-ex');

// 드롭다운 메뉴를 클릭하면 해당 드롭다운 메뉴의 텍스트로 드롭다운 버튼의 텍스트가 변경된다
document.addEventListener('DOMContentLoaded', function() {
    let dropdownItems = document.getElementsByClassName('folder-dropdown-item');
  
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
    td.classList.add('td-style');

    tr.appendChild(td);
    tbody.appendChild(tr);

    // 만약 단어를 추가할 단어가 5의 배수번째라면 tr에 추가하고, 새로운 tr을 만들고 그것을 tr에 대입해서 새로운 행을 추가한다 
    if(wordsList.length % 8 == 0){
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
        wordsList.splice(index, 1, "")

        // 삭제하려는 td 의 내용을 빈 내용으로 만든다 (테이블 형식 유지)
        tdToDelete.classList.add('hide');
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

if(searchBtn != undefined){
    searchBtn.addEventListener('click', async () => {

        // form 생성
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/store-result";

        // hidden input 추가
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = "wordsList";

        // wordsList 배열의 두 번째 요소로 검색 제목을 넣어준다
        if(titleInput.value.trim().length == 0){ // 사용자가 제목을 입력하지 않았을 때
            let date = new Date();
            let year = date.getFullYear();
            let month = ('0' + (date.getMonth() + 1)).slice(-2);
            let day = ('0' + date.getDate()).slice(-2);
            let hour = ('0' + date.getHours()).slice(-2);
            let min = ('0' + date.getMinutes()).slice(-2);

            let nowDate = year + "/" + month + "/" + day + "-" + hour + ":" + min
            
            wordsList.unshift(nowDate);
        } else { // 사용자가 제목을 입력했을 때
            wordsList.unshift(titleInput.value);
        }

        // wordsList 배열의 첫 번째 요소로 폴더의 이름을 넣어준다
        if(dropdownBtn.innerText.trim() === "Folder"){ // 사용자가 폴더를 선택하지 않았을 때
            wordsList.unshift("normal"); // 기본 폴더를 넣는다
        } else { // 사용자가 폴더를 선택했을 때
            wordsList.unshift(dropdownBtn.innerText);
        }

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
}


 // ============ pdf 다운로드 버튼 이벤트 설정 ============= //
pdfDownloadBtn.addEventListener('click', async () => {
    console.log(hideDef.checked)
    console.log(hideEx.checked)

    // form 생성
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/generate-pdf";

    // hidden input 추가
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "wordsList";


    // wordsList 배열의 3번째 요소로 사용자가 titleInput 에 입력한 제목을 넣어준다
    wordsList.unshift(titleInput.value);
    wordsList.unshift(hideEx.checked); // 2번째 요소로 hideEx 옵션을 넣어준다
    wordsList.unshift(hideDef.checked); // 1번째 요소로 hideDef 옵션을 넣어준다

    input.value = JSON.stringify(wordsList);

    // form 에 input 추가
    form.appendChild(input);

    // form 을 body에 추가하고 submit
    document.body.appendChild(form);
    form.submit();

    titleInput.value = null;
     
})