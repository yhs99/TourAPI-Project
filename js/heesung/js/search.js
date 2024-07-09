const API_KEY = "5dx9VltlDcWscOP7NLW0yH/slO2Tl2qnffXGNS1HOhuhhi2KUrHaEzADPUbDY0bUb0zn7FprTTiQHnIRcO1psw==";
const BASE_URL_AREACODE = `${location.protocol}//apis.data.go.kr/B551011/${localStorage.getItem("language") == "ko" ? "KorService1" : "EngService1"}/areaCode1`;
const BASE_URL_AREABASED_LIST = `${location.protocol}//apis.data.go.kr/B551011/${localStorage.getItem("language") == "ko" ? "KorService1" : "EngService1"}/areaBasedList1`;
const BASE_URL_KEYWORD = `${location.protocol}//apis.data.go.kr/B551011/${localStorage.getItem("language") == "ko" ? "KorService1" : "EngService1"}/searchKeyword1`;
const BASE_URL_LOCATION = `${location.protocol}//apis.data.go.kr/B551011/${localStorage.getItem("language") == "ko" ? "KorService1" : "EngService1"}/locationBasedList1`;

const numOfRows = 10;
const contentTypeId = localStorage.getItem("language") == "ko" ? 25 : 76;
let parser = new DOMParser();
let xmlDoc;
let pageNo = 1;
let isFirst = true;
let isLoaded = true;
let isLastPage = false;
let title = "";
let currentSearch = "getItemListByAreaCode";
const serviceCode = {
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

$(() => {
  getAreaCode();
  getItemListByAreaCode();
  $(document).on('change', '.areaCode_radio', function() {
    pageNo=1;
    isLastPage=false;
    $("#small_areaCode").hide();
    $("input:radio[name=sigungu]").prop("checked", false);
    $("#title").html("#"+$(this)[0].classList[1]);
    if($("#searchInput").val().length >= 2) {
      $("input:radio[name=sigungu]").prop("checked", false);
      getAreaCode();
      getItemListByAreaCodeWithKeyword();
    }else {
      if(isFirst) {
        getAreaCode();
        getItemListByAreaCode();
      }else {
        getAreaCode();
        getItemListByAreaCode();
      }
    }
  })

  $(document).on('change', '.areaCode_radio2', function() {
    pageNo=1;
    isLastPage=false;
    if($("#searchInput").val().length >= 2) {
      getItemListByAreaCodeWithKeyword();
    }else {
      getItemListByAreaCode();
    }
  });

  $("#searchInput").keyup(function(e) {
    pageNo=1;
    isLastPage=false;
    if(e.keyCode === 13) {
      if($("#searchInput").val().length < 2) {
        $("#exception").show();
      }else {
        getItemListByAreaCodeWithKeyword();
        $("#exception").hide();
      }
    }
  })
  //무한스크롤
  /**
   * 현재 검색 종류 및 페이지에 따른 요청을 처리합니다
   */
  window.addEventListener("scroll", () => {
    const isScrollEnded =
      window.innerHeight + window.scrollY + 850 >= document.body.offsetHeight;
    if (isScrollEnded && isLoaded && !isLastPage && currentSearch=="searchByLocation") {
      pageNo++;
      getItemListByLocation(true);
    }else if (isScrollEnded && isLoaded && !isLastPage && $("#searchInput").val().length >= 2) {
      pageNo++;
      getItemListByAreaCodeWithKeyword(true);
    }else if(isScrollEnded && isLoaded && !isLastPage) {
      pageNo++;
      getItemListByAreaCode(true);
    }
  });

  $(document).on('change', '.sortclass', function() {
    pageNo=1;
    isLastPage=false;
    if(currentSearch == "searchByLocation") {
      getItemListByLocation();
    }else if($("#searchInput").val().length >= 2) {
      getItemListByAreaCodeWithKeyword();
    }else {
      getItemListByAreaCode();
    }
  });
})

function getAreaCode() {
  let areaCode = $("input:radio[name=areaCode]:checked").val();
  let data;
  if(!areaCode) {
    data = {
      MobileOS : "ETC",
      MobileApp : "testApp",
      _type : "json",
      serviceKey : API_KEY,
      numOfRows : 100,
    }
  }else {
    data = {
      areaCode : areaCode,
      MobileOS : "ETC",
      MobileApp : "testApp",
      _type : "json",
      serviceKey : API_KEY,
      numOfRows : 100,
    }
  }
  $.ajax({
    url: BASE_URL_AREACODE,
    data: data,
    dataType: "json",
    type: "get",
    success: function(response) {
      if(!areaCode) {
        renderAreaCode(response.response.body.items.item);
      }else {
        renderAreaCodeSmall(response.response.body.items.item);
      }
    },
    error: function(error) {
      console.error(error)
      console.error(error.responseText)
      xmlDoc = parser.parseFromString(error.responseText, "text/xml");
      
      if(xmlDoc.getElementsByTagName("returnReasonCode")[0].childNodes[0].nodeValue == '04' || xmlDoc.getElementsByTagName("returnReasonCode")[0].childNodes[0].nodeValue == '01') {
        showAndHideSpinner("show");
        //console.log("데이터 로딩중 에러가 발생해 재시도합니다.");
        setTimeout(() => {
          getAreaCode();
        }, 3000);
      }
    },
    beforeSend: function() {
      isLoaded = false;
      showAndHideSpinner("show");
    },
    complete : function() {
      isLoaded = true;
      showAndHideSpinner("hide");
    }
  });
}

function renderAreaCode(items) {
  let areaName = {
    "세종특별자치시" : "세종",
    "경기도" : "경기",
    "강원특별자치도" : "강원",
    "충청북도" : "충북",
    "충청남도" : "충남",
    "경상북도" : "경북",
    "경상남도" : "경남",
    "전북특별자치도" : "전북",
    "전라남도" : "전남",
    "제주도" : "제주"
  }
  let template = `<ul class="h-auto big_area_ul">
                    <li class="areaCodes">
                        <input type="radio" class="areaCode_radio" name="areaCode" id="all" value="" checked>
                        <label for="all">전체</label>
                    </li>
  `;
  for(let item of items) {
    template += `
      <li class="areaCodes">
        <input type="radio" class="areaCode_radio ${item.name}" name="areaCode" id="${item.code}" value="${item.code}">
        <label for="${item.code}">${Object.keys(areaName).includes(item.name) ? areaName[item.name] : item.name}</label>
      </li>
    `
  }
  template += "</ul>";

  $("#big_areaCode").html(template);
}

function renderAreaCodeSmall(items) {
  let template = `<ul class="small_area_ul">
                    <li class="areaCodes smalls">
                        <input type="radio" class="areaCode_radio2" name="sigungu" id="all_small" value="" checked>
                        <label for="all_small">전체</label>
                    </li>`;

  for(let item of items) {
    template += `
      <li class="areaCodes smalls">
        <input type="radio" class="areaCode_radio2" name="sigungu" id="sigungu${item.code}" value="${item.code}">
        <label for="sigungu${item.code}">${item.name}</label>
      </li>
    `
  }
  template += "</ul>";
  
  $("#small_areaCode").html(template);
  $("#small_areaCode").slideDown();
}

function getItemListByAreaCode(isAppend=false) {
  let sort = $("input:radio[name=sort_radio]:checked").val();
  currentSearch = "getItemListByAreaCode";
  let area = $("input:radio[name=areaCode]:checked").val();
  let sigungu = $("input:radio[name=sigungu]:checked").val();
  area == "undefiend" ? area="" : $("input:radio[name=areaCode]:checked").val();
  sigungu == "undefiend" ? sigungu="" : $("input:radio[name=sigungu]:checked").val();
  let cat1 = "";
  let cat2 = "";
  let cat3 = "";

  let datas = {
    areaCode: area,
    sigunguCode: sigungu,
    cat1: cat1,
    cat2: cat2,
    cat3: cat3,
    listYN: "Y",
    _type: "json",
    numOfRows: numOfRows,
    pageNo: pageNo,
    serviceKey: API_KEY,
    contentTypeId: contentTypeId,
    arrange: sort,
    MobileApp: "TestApp",
    MobileOS: "ETC"
  }

  $.ajax({
    url: BASE_URL_AREABASED_LIST,
    data: datas,
    type: "get",
    dataType : "json",
    success : function(response) {
      //console.log(response);
      renderList(response.response, isAppend);
    },
    error: function(error) {
      console.error(error);
      console.error(error.responseText);
      xmlDoc = parser.parseFromString(error.responseText, "text/xml");
      
      if(xmlDoc.getElementsByTagName("returnReasonCode")[0].childNodes[0].nodeValue == '04' || xmlDoc.getElementsByTagName("returnReasonCode")[0].childNodes[0].nodeValue == '01') {
        showAndHideSpinner("show");
        //console.log("데이터 로딩중 에러가 발생해 재시도합니다.");
        setTimeout(() => {
          getItemListByAreaCode();
        }, 3000);
      }
    },
    beforeSend: function() {
      isLoaded = false;
      showAndHideSpinner("show");
    },
    complete : function() {
      isLoaded = true;
      showAndHideSpinner("hide");
    }
    
  });
}

function getItemListByAreaCodeWithKeyword(isAppend=false) {
  let sort = $("input:radio[name=sort_radio]:checked").val();
  currentSearch = "getItemListByAreaCodeWithKeyword";
  let area = $("input:radio[name=areaCode]:checked").val();
  let sigungu = $("input:radio[name=sigungu]:checked").val();
  let keyword = $("#searchInput").val();
  area == "undefiend" ? area="" : $("input:radio[name=areaCode]:checked").val();
  sigungu == "undefiend" ? sigungu="" : $("input:radio[name=sigungu]:checked").val();
  let cat1 = "";
  let cat2 = "";
  let cat3 = "";

  let datas = {
    MobileOS : "ETC",
    MobileApp : "testApp",
    _type : "json",
    serviceKey : API_KEY,
    numOfRows: numOfRows,
    keyword: keyword,
    pageNo: pageNo,
    areaCode: area,
    sigunguCode: sigungu,
    arrange: sort,
    cat1: cat1,
    cat2: cat2,
    cat3: cat3,
    contentTypeId: contentTypeId
  }

  $.ajax({
    url: BASE_URL_KEYWORD,
    data: datas,
    dataType: "json",
    type: "get",
    success: function(response) {
      //console.log(response);
      renderList(response.response,isAppend);
    },
    error: function(error) {
      console.error(error);
      console.error(error.responseText);
      xmlDoc = parser.parseFromString(error.responseText, "text/xml");
      
      if(xmlDoc.getElementsByTagName("returnReasonCode")[0].childNodes[0].nodeValue == '04' || xmlDoc.getElementsByTagName("returnReasonCode")[0].childNodes[0].nodeValue == '01') {
        showAndHideSpinner("show");
        //console.log("데이터 로딩중 에러가 발생해 재시도합니다.");
        setTimeout(() => {
          getItemListByAreaCodeWithKeyword();
        }, 3000);
      }
      
    },
    beforeSend: function() {
      isLoaded = false;
      showAndHideSpinner("show");
    },
    complete : function() {
      isLoaded = true;
      showAndHideSpinner("hide");
    }
  })
}

function renderList(items, isAppend) {
  let template = "";
  if(items.body.numOfRows == 0) {
    var toastElList = [].slice.call(document.querySelectorAll('#liveToast'))
    template = "결과가 없어요";
    isLastPage=true;
    
    var toastList = toastElList.map(function(toastEl) {
      return new bootstrap.Toast(toastEl)
    })
    toastList.forEach(toast => toast.show())
    $("#count").html(`${parseInt(items.body.totalCount).toLocaleString()}`);
    if(pageNo == 1) $(".course").html(template);
    else $(".course").append(template);
    return false;
  }
  if(items.body.totalCount > 0) { 
    let itemArr = items.body.items.item;
    for(let item of itemArr) {
      template += `
        <li class="course-lists py-3 border-bottom border-2">
          <div class="row list-content">
            <div class="col-1 bookmark">
              <i class="bi ${checkBookMark(item.contentid) ? 'bi-balloon-heart-fill' : 'bi-balloon-heart'}" style="color:red; cursor:pointer;" onclick="addBookMark('${item.contentid}', '${item.title}', '${item.firstimage}','./travel-course-sub.html?contentId=${item.contentid}', this)"></i>
            </div>
            <div class="col-3 list-image">
              <img src="${!item.firstimage2 ? './img/heesung/img/no-image.jpg' : item.firstimage2}" class="img-fluid w-100">
            </div>
            <div class="col-8 list-content-content">
              <h5 class="text-truncate"><a href="./travel-course-sub.html?contentId=${item.contentid}">${item.title}</a>
              <p class="pt-1" style="font-size:12px; overflow: hidden;">${isMatchAreaCode(item.areacode)} ${isMatchSigunguCode(item.areacode, item.sigungucode)}</p>
            </div>
            <div class="col list-hashtag">
              <ul>
                <li class="hashtag">#${Object.keys(serviceCode).includes(item.cat1) ? serviceCode[item.cat1] : item.cat1}</li>
                <li class="hashtag">#${Object.keys(serviceCode).includes(item.cat2) ? serviceCode[item.cat2] : item.cat2}</li>
                <li class="hashtag">#${Object.keys(serviceCode).includes(item.cat3) ? serviceCode[item.cat3] : item.cat3}</li>
              </ul>
            </div>
          </div>
        </li>
      `
    }
  }else {
    template = "결과가 없어요";
  }
  if(isAppend) {
    $(".course").append(template);
  }else {
    $(".course").html(template);
  }
  $("#count").html(`${parseInt(items.body.totalCount).toLocaleString()}`);
  
}

function showAndHideSpinner(e) {
  e == "show" ? $(".spinner_back").css("visibility", "visible") : $(".spinner_back").css("visibility", "hidden");
}

