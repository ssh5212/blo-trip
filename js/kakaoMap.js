let contentTypeId = 0; // 0이면 다 고르는 것

// 검색 버튼 눌렸을 때 실행
document.getElementById('btn-search').addEventListener('click', () => {
    // 검색 기본 url
    let searchUrl = `https://apis.data.go.kr/B551011/KorService1/searchKeyword1?serviceKey=${serviceKey}&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A`;

    // 추가 검색 속성값 적용
    let areaCode = document.getElementById('search-area').value;
    contentTypeId = document.getElementById('search-content-id').value;
    // console.log("contentT" + contentTypeId);
    let keyword = document.getElementById('search-keyword').value;

    if (parseInt(areaCode)) searchUrl += `&areaCode=${areaCode}`;
    if (parseInt(contentTypeId)) searchUrl += `&contentTypeId=${contentTypeId}`;
    if (!keyword) {
        alert('검색어 입력 필수!!!');
        return;
    } else searchUrl += `&keyword=${keyword}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => makeList(data));
});

var positions; // marker 배열.
function makeList(data) {
    document.querySelector('table').setAttribute('style', 'display: ;');
    let trips = data.response.body.items.item;
    let tripList = ``;
    positions = [];
    trips.forEach(area => {
        // console.log(area);
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
            image: area.firstimage,
        };
        positions.push(markerInfo);
    });
    document.getElementById('trip-list').innerHTML = tripList;
    displayMarker();
}

// 카카오지도
var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.500613, 127.036431), // 지도의 중심좌표
        level: 5, // 지도의 확대 레벨
    };

// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

function displayMarker() {
    // 마커 이미지의 이미지 주소입니다

    for (var i = 0; i < positions.length; i++) {
        let position_name = positions[i].title;
        let position_address = positions[i].addr;
        let position_image = positions[i].image;
        // 마커 이미지의 이미지 크기 입니다
        var imageSize = new kakao.maps.Size(24, 24);

        // 마커 이미지 고르기
        var imageSrc = `/img/marker_${positions[i].contenttypeid}.png`;

        // 마커 이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

        // 유형이 선택되지 않았으면 continue;
        if (contentTypeId != 0 && contentTypeId != positions[i].contenttypeid) {
            continue;
        }

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀
            image: markerImage, // 마커 이미지
        });

        // 마커 선택 시 토글 활성화
        kakao.maps.event.addListener(marker, 'click', () => {
            document.querySelector('#map_modal_title').innerText =
                position_name;
            document.querySelector('#map_modal_addr').innerText =
                position_address;
            document.querySelector('#map_modal_img').src = position_image;
            console.log(document.querySelector('#map_modal'));

            var myModal = new bootstrap.Modal(
                document.getElementById('map_modal'),
                {
                    keyboard: false,
                }
            );
            myModal.toggle();
        });
    }

    // 첫번째 검색 정보를 이용하여 지도 중심을 이동 시킵니다
    map.setCenter(positions[0].latlng);
}

function moveCenter(lat, lng) {
    map.setCenter(new kakao.maps.LatLng(lat, lng));
}

//////////////////////// 클러스터러 만들기
// // 마커 클러스터러를 생성합니다
// var clusterer = new kakao.maps.MarkerClusterer({
//     map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
//     averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
//     minLevel: 10 // 클러스터 할 최소 지도 레벨
// });

// // 데이터를 가져오기 위해 jQuery를 사용합니다
// // 데이터를 가져와 마커를 생성하고 클러스터러 객체에 넘겨줍니다
// $.get("/download/web/data/chicken.json", function(data) {
//     // 데이터에서 좌표 값을 가지고 마커를 표시합니다
//     // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
//     var markers = $(data.positions).map(function(i, position) {
//         return new kakao.maps.Marker({
//             position : new kakao.maps.LatLng(position.lat, position.lng)
//         });
//     });

//     // 클러스터러에 마커들을 추가합니다
//     clusterer.addMarkers(markers);
// });
