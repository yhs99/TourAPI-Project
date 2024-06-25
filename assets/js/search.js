const API_KEY = "5dx9VltlDcWscOP7NLW0yH/slO2Tl2qnffXGNS1HOhuhhi2KUrHaEzADPUbDY0bUb0zn7FprTTiQHnIRcO1psw==";
const BASE_URL_AREACODE = "http://apis.data.go.kr/B551011/KorService1/areaCode1";
const BASE_URL_AREABASED_LIST = "http://apis.data.go.kr/B551011/KorService1/areaBasedList1";
const BASE_URL_KEYWORD = "http://apis.data.go.kr/B551011/KorService1/searchKeyword1";
const numOfRows = 10;
let pageNo = 1;
let pIndex = 1;
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
    $(".title-hash").html($(this)[0].classList[1]);
    if($("#searchInput").val().length >= 2) {
      $("input:radio[name=sigungu]").prop("checked", false);
      getAreaCode();
      getItemListByAreaCodeWithKeyword();
    }else {
      if(isFirst) {
        getAreaCode();
        getItemListByAreaCode();
      }else {
        $("input:radio[name=sigungu]").prop("checked", false);
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
  window.addEventListener("scroll", () => {
    const isScrollEnded =
      window.innerHeight + window.scrollY + 850 >= document.body.offsetHeight;
    if (isScrollEnded && isLoaded && !isLastPage) {
      pageNo++;
      getItemListByAreaCode(true);
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
      console.log(response);
      if(!areaCode) {
        renderAreaCode(response.response.body.items.item);
      }else {
        renderAreaCodeSmall(response.response.body.items.item);
      }
    },
    error: function(error) {
      console.log(error)
      console.log(error.responseText)
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
                        <label for="all">전체</label>
                        <input type="radio" class="areaCode_radio" name="areaCode" id="all" value="" checked>
                    </li>
  `;
  for(let item of items) {
    template += `
      <li class="areaCodes">
        <label for="${item.code}">${Object.keys(areaName).includes(item.name) ? areaName[item.name] : item.name}</label>
        <input type="radio" class="areaCode_radio ${item.name}" name="areaCode" id="${item.code}" value="${item.code}">
      </li>
    `
  }
  template += "</ul>";

  $("#big_areaCode").html(template);
}

function renderAreaCodeSmall(items) {
  let template = `<ul class="small_area_ul">
                    <li class="areaCodes">
                        <label for="all_small">전체</label>
                        <input type="radio" class="areaCode_radio2" name="sigungu" id="all_small" value="" checked>
                    </li>`;

  for(let item of items) {
    template += `
      <li class="areaCodes">
        <label for="sigungu${item.code}">${item.name}</label>
        <input type="radio" class="areaCode_radio2" name="sigungu" id="sigungu${item.code}" value="${item.code}">
      </li>
    `
  }
  template += "</ul>";
  
  $("#small_areaCode").html(template);
  $("#small_areaCode").slideDown();
}

function getItemListByAreaCode(isAppend=false) {
  currentSearch = "getItemListByAreaCode";;
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
    contentTypeId: 25,
    arrange: "Q",
    MobileApp: "TestApp",
    MobileOS: "ETC"
  }

  $.ajax({
    url: BASE_URL_AREABASED_LIST,
    data: datas,
    type: "get",
    dataType : "json",
    success : function(response) {
      renderList(response.response, isAppend);
      console.log(response);
    },
    error: function(error) {
      console.log(error);
      console.log(error.responseText);
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
    cat1: cat1,
    cat2: cat2,
    cat3: cat3,
    contentTypeId: 25
  }

  $.ajax({
    url: BASE_URL_KEYWORD,
    data: datas,
    dataType: "json",
    type: "get",
    success: function(response) {
      console.log(response);
      renderList(response.response,isAppend);
    },
    error: function(error) {
      console.log(error);
      console.log(error.responseText);
    },
    beforeSend: function() {
      showAndHideSpinner("show");
    },
    complete : function() {
      showAndHideSpinner("hide");
    }
  })
}

function renderList(items, isAppend) {
  if(items.body.numOfRows == 0) {
    alert("마지막 페이지입니다.");
    isLastPage=true;
    return false;
  }
  let template = "";
  if(items.body.totalCount > 0) { 
    let itemArr = items.body.items.item;
    for(let item of itemArr) {
      template += `
        <li class="course-lists py-3 border-bottom border-2">
          <div class="row list-content">
            <div class="col-1 bookmark">
              <i class="bi ${checkBookMark(item.contentid) ? 'bi-balloon-heart-fill' : 'bi-balloon-heart'}" style="color:red; cursor:pointer;" onclick="addBookMark('${item.title}', ${item.contentid}, this)"></i>
            </div>
            <div class="col-3 list-image">
              <img src="${!item.firstimage2 ? './assets/img/no-image.jpg' : item.firstimage2}" class="img-fluid w-100">
            </div>
            <div class="col-8 list-content-content">
              <h5 class="text-truncate"><a href="./detail.html?contentId=${item.contentid}">${item.title}</a>
              <p></p>
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

