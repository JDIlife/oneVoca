// const input = document.getElementById("input");
const input = document.getElementById("wordInput");
const wordsInputBtn = document.getElementById("btn");

const wordsArea = document.getElementById("wordsArea");
let wordsTable = document.getElementById("wordsTable");

let wordsList = [];
let wordsCount = 0;


let tr = document.createElement("tr");

// 배열과 테이블에 단어를 추가하는 함수
let wordsInput = () => {
    wordsList.push(input.value)
    console.log(wordsList);
    wordsCount += 1;

    let tbody = wordsTable.children[1];
    let td = document.createElement("td");

    td.appendChild(document.createTextNode(input.value));
    tr.appendChild(td);
    tbody.appendChild(tr);

    // 만약 단어를 추가할 단어가 5의 배수번째라면 tr에 추가하고, 새로운 tr을 만들고 그것을 tr에 대입해서 새로운 행을 추가한다 
    if(wordsCount % 5 == 0){
        tr.appendChild(td);
        let ntr = document.createElement("tr");
        tr = ntr
    }

    // input 의 입력값을 비운다
    input.value = null;
}

// 단어 입력 input 창에서 Enter 를 입력하면 자동으로 단어가 추가된다
input.addEventListener("keypress", (event)=>{
    if(event.key === 'Enter'){
        wordsInput();
    }
})

// 단어 입력 버튼에 이벤트 설정
wordsInputBtn.addEventListener("click", wordsInput);