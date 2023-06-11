let withdrawalLi = document.getElementById('withdrawal-li');
let normalFolder = document.getElementById('normal-folder');
let hideDefSwitch = document.getElementById('hideDefSwitch');
let hideExSwitch = document.getElementById('hideExSwitch');

let folderSubmitBtn = document.getElementById('folderSubmitBtn');
let folderNameInput = document.getElementById('folderNameInput');

// 사용자의 폴더 버튼을 모아놓은 Div
let folderBtnDiv = document.getElementById('folder')

// 해당 폴더의 검색 제목 버튼을 모아놓은 Aside
let folderTitleAside = document.getElementById('folderTitleAside');

// =========================== 폴더 생성 ========================= //

// 폴더 버튼과 폴더 이름 입력 input 에 이벤트 부착
folderSubmitBtn.addEventListener('click', addFolderBtn);
folderNameInput.addEventListener('keydown', (event) => {
    if(event.key == 'Enter'){
        addFolderBtn.call(event.target);
    }
})

// 폴더 생성 modal 확인 버튼을 누르면 새로운 폴더 버튼을 생성하고 modal 을 닫는 함수
function addFolderBtn() {
    let folderName = folderNameInput.value;

    // 폴더 제목이 빈칸이라면 폴더를 생성할 수 없게한다
    if(folderName.trim().length == 0){
        folderNameInput.placeholder = "폴더 제목을 입력해주세요";
        return false;
    } else {
        folderNameInput.placeholder = "";
    }

    fetch("/store-folder", {
        method:"POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            folderName: folderName
        })
    }).then(res => res.json())
    .then(data => {

        let prevP = document.createElement('p');

        // 새로운 폴더 버튼 생성
        let btnGroupDiv = document.createElement('div');
        btnGroupDiv.classList.add("btn-group");
        btnGroupDiv.innerHTML = `
            <button class="btn btn-info folder-btn" type="button" data-bs-toggle="collapse" data-bs-target="#folder${data.newFolderId}" aria-expanded="false" aria-controls="collapseWidthExample">
                ${folderName}
            </button>
            <button type="button" class="btn btn-sm btn-info  dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="visually-hidden">Toggle Dropdown</span>
            </button>
            <ul class="dropdown-menu">
                <li><a class="dropdown-item delete-folder-btn" href="#" data-bs-target="#${data.newFolderId}">Delete</a></li>
            </ul>
                                `;
    
        let nextP = document.createElement('p');
    
        folderBtnDiv.appendChild(prevP);
        folderBtnDiv.appendChild(btnGroupDiv);
        folderBtnDiv.appendChild(nextP);
    
    
        // 새로운 폴더 제목 영역 생성
        let folderTitleDiv = document.createElement('div');
        folderTitleDiv.classList.add("collapse", "collapse-horizontal");
        folderTitleDiv.id = `folder${data.newFolderId}`;
        folderTitleDiv.innerHTML = `
            <div class="card card-body title-collapse" style="width:20vw;"> 
            </div>
                                    `;
    
        let folderTitleAside = document.getElementById('folderTitleAside');
        folderTitleAside.appendChild(folderTitleDiv);
    
    
        // 새로운 폴더 단어 결과 영역 생성
        let folderWordDiv = document.createElement('div');
        folderWordDiv.classList.add("collapse-horizontal", "collapse");
        folderWordDiv.id = `folder${data.newFolderId}`;
        folderWordDiv.innerHTML = `
            <div class="card card-body word-div" style="width: 50vw;">
            </div>
        
                                `;
    
        let section = document.querySelector('section');
        section.appendChild(folderWordDiv);
        
        // 새로운 폴더 중복단어 영역 생성
        let folderDupWordDiv = document.createElement('div');
        folderDupWordDiv.classList.add("collapse-horizontal", "collapse");
        folderDupWordDiv.id = `folder${data.newFolderId}`;
    
        folderDupWordDiv.innerHTML = `
            <div class="card card-body" style="width: 20vw;">
               <p>자주 검색한 단어</p> 
            </div>
                                    `;
        
        let dupWordAside = document.getElementById('dupWordAside');
        dupWordAside.appendChild(folderDupWordDiv);
        
    });

    // 폴더 제목 입력 부분을 비워준다
    folderNameInput.value = null

    // 확인 버튼을 누른 뒤 modal 을 닫는다
    let modal = this.closest('.modal');
    modal.classList.remove('show');
    let body = document.querySelector('body');
    body.removeAttribute('class');
    body.removeAttribute('style');

    let modalBackdrop = document.querySelector('.modal-backdrop');
    modalBackdrop.remove();

}

// ============================ 폴더, 검색결과 삭제 ================================ //

// 폴더 버튼을 담고있는 folderBtnDiv 에 이벤트 위임을 사용해서 delete-folder-btn 클래스를 가지고 있는 요소에 데이터 삭제 함수 호출
folderBtnDiv.addEventListener('click', (event) => {
    if(event.target.classList.contains('delete-folder-btn')){
        deleteData.call(event.target, "folder");
    }
});

// 검색 제목 버튼을 담고있는 folderTitleAside 에 이벤트 위임을 사용해서 delete-title-btn 클래스를 가지고 있는 요소에 데이터 삭제 함수 호출
folderTitleAside.addEventListener('click', (event) => {
    if(event.target.classList.contains('delete-title-btn')){
        deleteData.call(event.target, "title");
    }
});


// 데이터 삭제 기능
function deleteData(deleteObj){

    let deleteConfirm = confirm('정말 삭제하시겠습니까?');

    let idValue = this.getAttribute("data-bs-target");
    let id = idValue.substring(1);

    // 사용자가 confirm 에서 확인했다면
    if(deleteConfirm){
        fetch("/delete/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                deleteObj: deleteObj
            })
        });
    
        // 삭제가 클릭된 버튼요소를 클라이언트에서 삭제한다
        let parentDiv = this.closest('.btn-group');
        
        if(parentDiv){
            let prevP = parentDiv.previousElementSibling
            let nextP = parentDiv.nextElementSibling
            prevP.remove();
            nextP.remove();

            parentDiv.remove();
        }
        
        let deletedElements = document.querySelectorAll(`#${deleteObj}${id}`);
        deletedElements.forEach((el) => {
            el.remove();
        })

    }

}

// ============================== 단어 숨기기, 예문 숨기기 ============================= //

// 단어 숨기기, 예문 숨기기 이벤트 부착
hideDefSwitch.addEventListener('click', () => {

    hideDefEx("definition");
});

hideExSwitch.addEventListener('click', () => {

    hideDefEx("example");
})

// 해당 클래스이름을 입력하면 해당 요소의 visibility 를 hidden 으로 토글하는 함수
function hideDefEx(className){
    let hidedText = document.getElementsByClassName(`${className}`);
    for(let i = 0; i < hidedText.length; i++){
        hidedText[i].classList.toggle("hide");
    }
}

// ============================= 선택되지 않은 collapse 접기 ============================= //

// 개인 페이지를 불러올 때 자동으로 사용자의 기본 폴더를 클릭하고 비활성화한다
document.addEventListener('DOMContentLoaded', () => {
    normalFolder.click();
    normalFolder.disabled = true;
});


// collapse 이벤트 부착
let folderDisBtn = null;
folderBtnDiv.addEventListener('click', (event) => {
    if(event.target.classList.contains('folder-btn')){

        folderDisBtn = toggleCollapse.call(event.target, 'collapse-horizontal', folderDisBtn);
    }
});

let titleDisBtn = null;
folderTitleAside.addEventListener('click', (event) => {
    if(event.target.classList.contains('title-collapse-btn')){

        titleDisBtn = toggleCollapse.call(event.target, 'word-collapse', titleDisBtn);
    }
});

// collapse 영역을 클릭했을 때, 이미 기존의 다른 collapse 영역이 펼쳐져있다면 기존의 펼쳐진 collapse 를 닫고, 클릭된 collapse 영역을 펼치는 함수
function toggleCollapse(collapseClass, disabledBtn){

    // 이전에 비활성화된 버튼을 활성화
    // disabledBtn : 이전에 비활성화된 버튼이 존재하는지 확인
    // disabledBtn !== this : 이전에 비활성화된 버튼이 현재 클릭된 버튼과 다른 버튼인지 확인
    if(disabledBtn && disabledBtn !== this){ // 이전의 disabledBtn 이 존재하고, disabledBtn 이 현재 클릭된 버튼과 다른 버튼일 때 참
        // 이게 실행이 안되는군
        console.log("if 1 passed")
        disabledBtn.disabled = false;
    }

    // 페이지 로드로 인해서 normal 폴더가 비활성화되어있으면 다시 활성화 시킨다 (다른 폴더 버튼을 눌렀을 때)
    if(normalFolder.disabled == true){
        console.log("if 2 passed")
        normalFolder.disabled = false;
    }

    this.disabled = true; // 클릭된 버튼을 비활성화
    disabledBtn = this; // 이전에 비활성화된 버튼으로 설정한다

    let target = this.getAttribute('data-bs-target');

    let collapseElement = document.getElementsByClassName(`${collapseClass}`);

    for(let j = 0; j < collapseElement.length; j++){
        if(collapseElement[j].id !== target.substring(1)){
            collapseElement[j].classList.remove("show");
        }
    }

    return disabledBtn;

}

// ================================== 회원탈퇴 ============================== //

// 회원탈퇴 기능
function withdrawal(){
    let withdrawal = confirm("정말로 회원탈퇴하시겠습니까?");
    if(withdrawal){
        const form = document.createElement("form");
        form.method = "POST";
        form.action = "/delete/withdrawal";

        document.body.appendChild(form);
        form.submit();
    }
}

withdrawalLi.addEventListener('click', withdrawal);