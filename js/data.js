window.onload = init();

function init() {
    
}

// 마이페이지에서 쓰는 함수 두 개입니당
function goModify(){
    console.log("수정페이지");
    document.getElementById("removeId").style.display = "none";
    document.getElementById("modifyContents").style.display = "contents";
}

function goDelete(){
    console.log("삭제페이지");
    document.getElementById("removeId").style.display = "contents";
    document.getElementById("modifyContents").style.display = "none";
}