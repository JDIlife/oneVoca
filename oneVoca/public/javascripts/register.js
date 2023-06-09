let idInput = document.getElementById('userId');
let idCheckBtn = document.getElementById('id-check-btn');
let idCheckSpan = document.getElementById('id-check-span');

let registerForm = document.querySelector('form');
let emailCheckBtn = document.getElementById('email-check-btn');
let emailCheckSpan = document.getElementById('email-check-span');

let idAlert = document.getElementById('id-alert-p');
let pwAlert = document.getElementById('pw-alert-p');


// id 중복 확인 이벤트 부착
idCheckBtn.addEventListener('click', checkIdRedundancy);

// id 중복 확인 요청 함수
function checkIdRedundancy(){

    let id = idInput.value;

    fetch("/register/redundancy", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        })
    }).then((res) => res.json())
    .then(data => {
        if(data.ExistenceCheck == 0){ // 중복되는 Id 가 존재하지 않을 때
            idCheckSpan.innerHTML = `<i class="fa-solid fa-circle-check" style="color: blue;"></i> 사용 가능한 id입니다.`;
            registerForm.idCheckInput.value = 1;
        } else { // Id가 중복될 때
            idCheckSpan.innerHTML = `<i class="fa-solid fa-ban" style="color: red;"></i> 사용할 수 없는 id입니다.`;
            registerForm.idCheckInput.value = 0;
        }
    });

}

// 이메일 형식 확인 이벤트 부착
emailCheckBtn.addEventListener('click', () => {
    let email = registerForm.userEmail.value;

    checkEmailValidation(email);
});

// 이메일 형식 확인 함수
function checkEmailValidation(email){

    let emailRegex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i

    if(!emailRegex.test(email)){
        emailCheckSpan.innerHTML = `<i class="fa-solid fa-ban" style="color: red;"></i> 사용할 수 없는 email입니다.`;
        registerForm.emailCheckInput.value = 0;
    } else {
        emailCheckSpan.innerHTML = `<i class="fa-solid fa-circle-check" style="color: blue;"></i> 사용 가능한 email입니다.`;
        registerForm.emailCheckInput.value = 1;
    }

}

// 회원가입 form 확인 함수
function checkFormValidation(){

    let idInput = registerForm.userId;
    let pwInput = registerForm.userPw;
    let pwdInput = registerForm.userPwConfirm;
    let emailInput = registerForm.userEmail;

    // 회원가입 form 에 입력되는 값들을 가져온다
    let id = registerForm.userId.value;
    let pw = registerForm.userPw.value;
    let pwDoubleCheck = registerForm.userPwConfirm.value;
    let email = registerForm.userEmail.value;
    let emailAgree = registerForm.emailAgree.checked;

    let idCheck = registerForm.idCheckInput.value;
    let emailCheck = registerForm.emailCheckInput.value;

    // 유효성 확인 정규식
    let idRegex = /^[a-z0-9]+$/
    let pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/

    // form 의 입력요소들이 공백인지 확인
    if(id.length == 0){
        alert('아이디를 입력해주세요.')

        idInput.focus();

        return false;
    }

    if(pw.length == 0){
        alert('비밀번호를 입력해주세요.')

        pwInput.focus();

        return false;
    }

    if(email.length == 0){
        alert('이메일을 입력해주세요.');

        emailInput.focus();

        return false;
    }

    // id 중복확인과 email 유효성 확인을 했는지 확인
    if(!parseInt(idCheck)){
        alert('id 중복확인을 해주세요.');

        return false;
    }

    if(!parseInt(emailCheck)){
        alert('email 확인을 해주세요.');

        return false;
    }

    // 입력값의 유효성 확인
    if(!idRegex.test(id)){
        idAlert.innerText = '유효하지 않은 아이디입니다.';

        return false;
    } else {
        idAlert.innerText = '유효한 아이디입니다.';
    }

    if(!pwRegex.test(pw)){
        pwAlert.innerText = '유효하지 않은 비밀번호입니다.';

        return false;
    } else {
        pwAlert.innerText = '유효한 비밀번호입니다.';
    }

    if(pw != pwDoubleCheck){
        alert('비밀번호가 일치하지 않습니다.')

        pwdInput.focus();

        return false;
    }


    if(!emailAgree){
        alert('이메일 수집에 동의해주십시요.')

        return false;
    }

}

// 사용자 입력값에 따라 실시간으로 사용 가능 여부를 알려주는 이벤트
registerForm.userId.addEventListener('keyup', () => {
    let idRegex = /^[a-z0-9]+$/
    if(!idRegex.test(registerForm.userId.value)){
        idAlert.innerText = '사용할 수 없는 아이디입니다.';
        idAlert.classList.remove('confirm-p');
    } else {
        idAlert.innerText = '사용가능한 아이디입니다.';
        idAlert.classList.add('confirm-p');
    }
});

// 사용자 입력값에 따라 실시간으로 사용 가능 여부를 알려주는 이벤트
registerForm.userPw.addEventListener('keyup', () => {
    let pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
    if(!pwRegex.test(registerForm.userPw.value)){
        pwAlert.innerText = '사용할 수 없는 비밀번호입니다.';
        pwAlert.classList.remove('confirm-p');
    } else {
        pwAlert.innerText = '사용가능한 비밀번호입니다.';
        pwAlert.classList.add('confirm-p');
    }
});

