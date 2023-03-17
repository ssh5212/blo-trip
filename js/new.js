// 10 : 지역코드조회
// 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
// 13 : 지역 기반 관광정보조회
let serviceKey = "M3KVNZZ77dEKVDzXocK%2BBbXaXghygQd25WflNl70WZA9pOgx2ihFZSzaJbarptjUqHil53iFe%2F1oNLZtbi0DHg%3D%3D";
let areaUrl = "https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey="+serviceKey+"&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json";
var currAreaNum = -1;
var currSigunguNum = -1;
var types = [12, 14, 15, 25, 28, 32, 38, 39];
var originTypeNums = [12, 14, 15, 25, 28, 32, 38, 39];
var currResults = [];

window.onload = init();

function init() {
    fetchAllAreas(areaUrl);
    document.getElementById("select-all-btn").addEventListener("click", selectAll);
    var checks = document.getElementsByClassName("form-check-input");

    for (i = 0; i < checks.length; i++) {
        checks[i].addEventListener("click", selectType);
    }
}

function fetchAllAreas(areaUrl) {
    fetch(areaUrl)
  .then((response) => response.json())
  .then((data) => makeOption(data));
}

function makeOption(data) {
    let areas = data.response.body.items.item;
    let sel = document.getElementById("search-area-sel");
    areas.forEach(function (area) {
    let opt = document.createElement("option");
        opt.setAttribute("value", area.code);
        opt.appendChild(document.createTextNode(area.name));
        sel.appendChild(opt);
    });
}

function changeAreaSel() {
    let detailSel = document.getElementById("search-area-detail-sel");
    let cnt = detailSel.options.length;
    for (i = 0; i < cnt; i++) {
        detailSel.options[0].remove();
    }

    var currSel = document.getElementById("search-area-sel")
    currAreaNum = currSel.options[currSel.selectedIndex].value;
    currSigunguNum = -1;
    
    let areaDetailUrl = "https://apis.data.go.kr/B551011/KorService1/areaCode1?serviceKey=M3KVNZZ77dEKVDzXocK%2BBbXaXghygQd25WflNl70WZA9pOgx2ihFZSzaJbarptjUqHil53iFe%2F1oNLZtbi0DHg%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&areaCode=" + currAreaNum + "&_type=json";
    fetch(areaDetailUrl)
        .then((response) => response.json())
        .then((data) => makeDetailOption(data));
} 

function makeDetailOption(data) {
    let areas = data.response.body.items.item;
    let sel = document.getElementById("search-area-detail-sel");

    areas.forEach(function (area) {
    let opt = document.createElement("option");
        opt.setAttribute("value", area.code);
        opt.appendChild(document.createTextNode(area.name));
        sel.appendChild(opt);
    });
}

function changeSigunguSel() {
    var currSel = document.getElementById("search-area-detail-sel")
    currSigunguNum = currSel.options[currSel.selectedIndex].value;
    getTrips();
}

function selectAll() {
    types = [12, 14, 15, 25, 28, 32, 38, 39];
    var checks = document.getElementsByClassName("form-check-input");

    for (i = 0; i < checks.length; i++) {
        checks[i].checked = true;
    }
    getTrips();
}

function selectType() {
    types = [];
    var checks = document.getElementsByClassName("form-check-input");

    for (i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            types.push(originTypeNums[i]);
        }
    }
    getTrips();
}

function getTrips() {
    currResults = [];
    for (i = 0; i < types.length; i++) {
        let tripsUrl = "https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=M3KVNZZ77dEKVDzXocK%2BBbXaXghygQd25WflNl70WZA9pOgx2ihFZSzaJbarptjUqHil53iFe%2F1oNLZtbi0DHg%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&contentTypeId=" + types[i] + "&areaCode=" + currAreaNum + "&sigunguCode=" + currSigunguNum;
        fetch(tripsUrl)
            .then((response) => response.json())
            .then((data) => getResults(data));
    }
    console.log(currResults);
}

function getResults(result) {
    if (!result.response.body.items.item) return;
    var tmp = result.response.body.items.item;
    for (i = 0; i < tmp.length; i++) {
       // console.log(tmp[i]);
        var data = new Object();

        data.addr1 = tmp[i].addr1;
        data.title = tmp[i].title;
        data.mapx = tmp[i].mapx;
        data.mapy = tmp[i].mapy;
        data.firstimage = tmp[i].firstimage;
        data.areacode = tmp[i].areacode;
        data.sigungucode = tmp[i].sigungucode;
        data.contenttypeid = tmp[i].contenttypeid;
        currResults.push(data);
    }
}