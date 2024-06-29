let contentId = new URLSearchParams(location.search).get("contentId");
if(!contentId) location.href="./error.html";
const API_KEY = "5dx9VltlDcWscOP7NLW0yH/slO2Tl2qnffXGNS1HOhuhhi2KUrHaEzADPUbDY0bUb0zn7FprTTiQHnIRcO1psw==";
const BASE_URL_COMMON = `${location.protocol}//apis.data.go.kr/B551011/KorService1/detailCommon1`
const BASE_URL_INTRO = `${location.protocol}//apis.data.go.kr/B551011/KorService1/detailIntro1`
const BASE_URL_INFO = `${location.protocol}//apis.data.go.kr/B551011/KorService1/detailInfo1`
const BASE_URL_IMAGE = `${location.protocol}//apis.data.go.kr/B551011/KorService1/detailImage1`
const COMMON_PARAM = {MobileOS : "ETC", MobileApp : "TestApp", _type : "json", contentId : contentId, defaultYN : "Y", firstImageYN : "Y", areacodeYN : "Y", catcodeYN : "Y", addrinfoYN : "Y", mapinfoYN : "Y", overviewYN : "Y", serviceKey: API_KEY};
const INTRO_PARAM = {MobileOS : "ETC", MobileApp : "TestApp", _type : "json", contentId: contentId, contentTypeId : "25", serviceKey: API_KEY};
const INFO_PARAM = {MobileOS : "ETC", MobileApp : "TestApp", _type : "json", contentId: contentId, contentTypeId : "25", serviceKey: API_KEY};
const IMAGE_PARAM = {MobileOS : "ETC", MobileApp : "TestApp", _type : "json", contentId: contentId, imageYN: "Y", subImageYN: "Y", serviceKey: API_KEY};
const serviceCodes = {
  C01 : "추천코스",
  C0112 : "가족코스",
  C0113 : "나홀로코스",
  C0114 : "힐링코스",
  C0115 : "도보코스",
  C0116 : "캠핑코스",
  C0117 : "맛코스",
  C01120001	: "가족코스",
  C01130001	: "나홀로코스",
  C01140001	: "힐링코스",
  C01150001	: "도보코스",
  C01160001	: "캠핑코스",
  C01170001	: "맛코스"
}
var defaultInfo;
var introInfo;
var routesInfo;
let routesDefaultInfo = [];

getDefaultInfo();

function bookmark() {
  addBookMark(defaultInfo.title, contentId, $(".balloon"));
}

function getDefaultInfo() {
  $.ajax({
    url: BASE_URL_COMMON,
    data: COMMON_PARAM,
    dataType: "json",
    type: "get",
    success : function(response) {
      //console.log("====COMMONINFO=====")
      //console.log(response.response.body.items.item[0]);
      defaultInfo = response.response.body.items.item[0];
    },
    error: function(error) {
      //console.log(BASE_URL_COMMON);
      //console.log(error.responseText);
      throw(error);
    },
    beforeSend: function() {
      showAndHideSpinner("show");
    },
    complete : function() {
      showAndHideSpinner("hide");
    }
  }).then(() => {
    getIntroInfo();
  })
}

function getIntroInfo() {
  $.ajax({
    url: BASE_URL_INTRO,
    data: INTRO_PARAM,
    dataType: "json",
    type: "get",
    success : function(response) {
      //console.log("====INTROINFO=====")
      //console.log(response.response.body.items.item[0]);
      introInfo = response.response.body.items.item[0];
    },
    error: function(error) {
      //console.log(BASE_URL_INTRO)
      //console.log(error.responseText)
      throw(error);
    },
    beforeSend: function() {
      showAndHideSpinner("show");
    },
    complete : function() {
      showAndHideSpinner("hide");
    }
  }).then(() => {
    getRoutesInfo();
  })
}

function getRoutesInfo() {
  $.ajax({
    url: BASE_URL_INFO,
    data: INFO_PARAM,
    dataType: "json",
    type: "get",
    success : function(response) {
      //console.log("====ROUTEINFO=====")
      //console.log(response.response.body.items.item)
      getRoutesDefaultInfo(response.response.body.items.item);
      routesInfo = response.response.body.items.item;
    },
    error: function(error) {
      //console.log(BASE_URL_INFO)
      //console.log(error.responseText)
      throw(error);
    },
    beforeSend: function() {
      showAndHideSpinner("show");
    },
    complete : function() {
      showAndHideSpinner("hide");
    }
  })
}

function getRoutesDefaultInfo(items) {
  console.log(items);
  if(items.length > 0) {
    for(let route in items) {
      let params = {MobileOS : "ETC", MobileApp : "TestApp", _type : "json", contentId : items[route].subcontentid, defaultYN : "Y", firstImageYN : "Y", areacodeYN : "Y", catcodeYN : "Y", addrinfoYN : "Y", mapinfoYN : "Y", overviewYN : "Y", serviceKey: API_KEY};
      $.ajax({
        url:BASE_URL_COMMON,
        data: params,
        type: "get",
        dataType: "json",
        async: false,
        success: function(response) {
          if(response.response.body.totalCount > 0) {
            console.log(response);
            let resData = response.response.body.items.item[0];
            let data = {
              contentid : resData.contentid,
              title : resData.title,
              firstimage : resData.firstimage,
              firstimage2 : resData.firstimage2,
              areaCode : resData.areacode,
              sigunguCode : resData.sigungucode,
              cat1 : resData.cat1,
              cat2 : resData.cat2,
              cat3 : resData.cat3,
              addr1 : resData.addr1,
              addr2 : resData.addr2,
              mapx: resData.mapx,
              mapy : resData.mapy,
              overview : resData.overview
            }
            routesDefaultInfo.push(data);
          }
        },
        error: function(error) {
          //console.log(BASE_URL_INFO)
          //console.log(error.responseText)
          throw(error);
        },
        beforeSend: function() {
          showAndHideSpinner("show");
        },
        complete : function() {
          showAndHideSpinner("hide");
        }
      });
    }
    renderKAKAOMap();
    renderDocument();
  }
}

function renderDocument() {
  //console.log(routesDefaultInfo);
  if(routesDefaultInfo.length > 5) $(".list-group").removeClass("d-flex").removeClass("justify-content-center");
  $(".badge").html(routesDefaultInfo.length + "코스");
  $("#title-travelcourse-title").html(defaultInfo.title);
  if(defaultInfo.addr1) {
    let address = defaultInfo.addr1;
    address = address.split(" ");
    $("#title-course-info").html(`${address[0]} ${address[1]}`);
  }else {
    let address = routesDefaultInfo[0].addr1;
    address = address.split(" ");
    $("#title-course-info").html(`${address[0]} ${address[1]}`);
  }
  $("#course-total").html(`코스 총 거리 : ${introInfo.distance}`);
  $("#taketime").html(`${introInfo.taketime}`);
  $("#theme").html(`${Object.keys(serviceCodes).includes(defaultInfo.cat3) ? serviceCodes[defaultInfo.cat3] : serviceCodes[defaultInfo.cat1]}`);

  let templateRoute_1 = "";
  let templateRoute_2 = "";
  let tags = "";
  let noimageURL = "./assets/img/no-image.jpg";
  for(let route in routesDefaultInfo) {
    templateRoute_1 += `
    <li class="lists">
        <a class="list-group-item list-item list-group-item-action ${route==0 ? 'active' : ''}" id="list-item${routesDefaultInfo[route].contentid}-list" data-bs-toggle="list" href="#list-item${routesDefaultInfo[route].contentid}" role="tab" aria-controls="list-item${routesDefaultInfo[route].contentid}" style="width:180px; height: 180px; background: no-repeat url('${routesDefaultInfo[route].firstimage !="" ? routesDefaultInfo[route].firstimage : noimageURL}') 50% 50% / cover;">
            <div>
                <span class="${routesDefaultInfo[route].firstimage=='' ? 'text-dark' : ''}">${routesDefaultInfo[route].title}</span>
            </div>
        </a>
    </li>`;
    templateRoute_2 += `
    <div class="tab-pane fade show ${route==0 ? 'active' : ''}" id="list-item${routesDefaultInfo[route].contentid}" role="tabpanel" aria-labelledby="list-item${routesDefaultInfo[route].contentid}-list">
        <div class="text-center">
            <h2 class="py-3">${routesDefaultInfo[route].title}</h2>
            <p><small>${routesDefaultInfo[route].addr1 ? routesDefaultInfo[route].addr1 : ''}</small></p>
            <span>
              ${routesDefaultInfo[route].overview}
            </span>
        </div>
    </div>
    `;
    tags += `
      #${routesDefaultInfo[route].title} 
    `
  }
  $(".list-group").html(templateRoute_1);
  $("#nav-tabContent").html(templateRoute_2);
  $("#tags").html(tags);
}
function renderKAKAOMap() {
  let zoom = 7;
  let distance = parseInt(introInfo.distance);
  if(distance > 0 && distance <= 20) {
    zoom = 7;
  }else if(distance > 20 && distance <= 50) {
    zoom = 8;
  }else if(distance > 50 && distance <= 90) {
    zoom = 9;
  } else {
    zoom = 11;
  }
  //console.log(routesDefaultInfo);
  let container = document.getElementById('map');
  let options = {
    center: new kakao.maps.LatLng(routesDefaultInfo[1].mapy, routesDefaultInfo[1].mapx), //지도의 중심좌표.
    level: zoom //지도의 레벨(확대, 축소 정도)
  }

  let lines=[],positions = []
  let imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
  for(let routes of routesDefaultInfo) {
    lines.push(new kakao.maps.LatLng(routes.mapy, routes.mapx));
    positions.push({
      title: routes.title,
      latlng: new kakao.maps.LatLng(routes.mapy, routes.mapx)
    });
  }
  var polyline = new kakao.maps.Polyline({
    path: lines, // 선을 구성하는 좌표배열 입니다
    strokeWeight: 4, // 선의 두께 입니다
    strokeColor: '#000000', // 선의 색깔입니다
    strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
    strokeStyle: 'solid' // 선의 스타일입니다
  });

  

  var map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
  polyline.setMap(map);
  for (var i = 0; i < positions.length; i ++) {
    
    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new kakao.maps.Size(24, 35); 
    
    // 마커 이미지를 생성합니다    
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
    
    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
        image : markerImage // 마커 이미지 
      });
  }
}

function showAndHideSpinner(e) {
  e == "show" ? $(".spinner_back").css("visibility", "visible") : $(".spinner_back").css("visibility", "hidden");
}
