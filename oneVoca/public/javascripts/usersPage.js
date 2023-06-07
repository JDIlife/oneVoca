let withdrawalLi = document.getElementById('withdrawal-li');
let normalFolder = document.getElementById('normal-folder');
let hideDefSwitch = document.getElementById('hideDefSwitch');
let hideExSwitch = document.getElementById('hideExSwitch');

// let folderBtn = document.getElementsByClassName('folder-btn');
let deleteFolderBtn = document.getElementsByClassName('delete-folder-btn');
let deleteTitleBtn = document.getElementsByClassName('delete-title-btn');

// 폴더 삭제 a 태그들에 폴더 삭제 이벤트를 붙인다
for(let i = 0; i < deleteFolderBtn.length; i++){
    deleteFolderBtn[i].addEventListener('click', (event) => {
        deleteData.call(event.target, "folder");
    });
}

// 제목 삭제 a 태그들에 제목+단어 삭제 이벤트를 붙인다
for(let i = 0; i < deleteTitleBtn.length; i++){
    deleteTitleBtn[i].addEventListener('click', (event) => {
        console.log(this)
        deleteData.call(event.target, "title");
    });
}

// 사용자 데이터 삭제 동작을 요청하는 함수
function deleteData(deleteObj){

    let deleteConfirm = confirm('정말 삭제하시겠습니까?');

    // 사용자가 폴더를 삭제한다면 form 에 folderId 를 담아서 /delete/folder 로 POST 요청한다
    if(deleteConfirm){
        const form = document.createElement("form");
        form.method = "POST";
        form.action = `/delete/${deleteObj}`;

        const input = document.createElement("input");
        input.type = "hidden";
        input.name = `${deleteObj}Id`;

        // id 값을 input 에 넣는다
        let idValue = this.getAttribute("data-bs-target");
        input.value = idValue.substring(1);

        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();

    }

}


// 개인 페이지를 불러올 때 자동으로 사용자의 기본 폴더를 클릭하고 비활성화한다
document.addEventListener('DOMContentLoaded', () => {
    normalFolder.click();
    normalFolder.disabled = true;
});

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

document.addEventListener('DOMContentLoaded', () => {

    toggleCollapse('folder-btn', 'collapse-horizontal');
    toggleCollapse('title-collapse-btn', 'word-collapse');

});

// collapse 영역을 클릭했을 때, 이미 기존의 다른 collapse 영역이 펼쳐져있다면 기존의 펼쳐진 collapse 를 닫고, 클릭된 collapse 영역을 펼치는 함수
function toggleCollapse(btnClass, collapseClass){
    let folderBtn = document.getElementsByClassName(`${btnClass}`);

    let disabledBtn = null;

    for(let i = 0; i < folderBtn.length; i++){
        folderBtn[i].addEventListener('click', function(){

            // 이전에 비활성화된 버튼을 활성화
            // disabledBtn : 이전에 비활성화된 버튼이 존재하는지 확인
            // disabledBtn !== this : 이전에 비활성화된 버튼이 현재 클릭된 버튼과 다른 버튼인지 확인
            if(disabledBtn && disabledBtn !== this){ // 이전의 disabledBtn 이 존재하고, disabledBtn 이 현재 클릭된 버튼과 다른 버튼일 때 참
                disabledBtn.disabled = false;
            }

            // 페이지 로드로 인해서 normal 폴더가 비활성화되어있으면 다시 활성화 시킨다 (다른 폴더 버튼을 눌렀을 때)
            if(normalFolder.disabled == true){
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

        });
    }
}

// withdrawal 기능
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