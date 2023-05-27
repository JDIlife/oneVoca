// 폴더를 클릭하면 해당 폴더의 내용이 section 영역에 보여진다
document.addEventListener('DOMContentLoaded', function() {
    let folderBtn = document.getElementsByClassName('list-group-item');
  
    for (var i = 0; i < folderBtn.length; i++) {
      folderBtn[i].addEventListener('click', function(event) {
        event.preventDefault();
  
      });
    }
  });
