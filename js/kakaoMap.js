// 검색 버튼 눌렸을 때 실행
document.getElementById("btn-search").addEventListener("click", () => {
    // 검색 기본 url
    let searchUrl = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A`;

    // 추가 검색 속성값 적용
    let areaCode = document.getElementById("search-area").value;
    let contentTypeId = document.getElementById("search-content-id").value;
    let keyword = document.getElementById("search-keyword").value;

    if (parseInt(areaCode)) searchUrl += `&areaCode=${areaCode}`;
    if (parseInt(contentTypeId)) searchUrl += `&contentTypeId=${contentTypeId}`;
    if (!keyword) {
        alert("검색어 입력 필수!!!");
        return;
    } else searchUrl += `&keyword=${keyword}`;

    fetch(searchUrl)
        .then((response) => response.json())
        .then((data) => makeList(data));
});

var positions; // marker 배열.
function makeList(data) {

    document.querySelector("table").setAttribute("style", "display: ;");
    let trips = data.response.body.items.item;
    let tripList = ``;
    positions = [];
    trips.forEach((area) => {
        tripList += `
                    <tr onclick="moveCenter(${area.mapy}, ${area.mapx});">
                        <td><img src="${area.firstimage}" width="100px"></td>
                        <td>${area.title}</td>
                        <td>${area.addr1} ${area.addr2}</td>
                        <td class="table_riches">${area.mapy}</td>
                        <td class="table_riches">${area.mapx}</td>
                    </tr>
        `;

        // 관광타입(12:관광지, 14:문화시설, 15:축제공연행사, 25:여행코스, 28:레포츠, 32:숙박, 38:쇼핑, 39:음식점) ID
        let markerInfo = {
            title: area.title,
            latlng: new kakao.maps.LatLng(area.mapy, area.mapx),
            contenttypeid: area.contenttypeid,
            addr: area.addr1,
        };
        positions.push(markerInfo);
    });
    document.getElementById("trip-list").innerHTML = tripList;
    displayMarker();
}

// 카카오지도
var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

function displayMarker() {
    // 마커 이미지의 이미지 주소입니다
    
    for (var i = 0; i < positions.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 24);
        
        // 마커 이미지 고르기
        var imageSrc =
            `/img/marker_${positions[i].contenttypeid}.png`;

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage, // 마커 이미지
        });
    }

    // 첫번째 검색 정보를 이용하여 지도 중심을 이동 시킵니다
    map.setCenter(positions[0].latlng);
}

function moveCenter(lat, lng) {
    map.setCenter(new kakao.maps.LatLng(lat, lng));
}