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