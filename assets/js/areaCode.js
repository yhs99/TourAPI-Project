const API_KEY = "5dx9VltlDcWscOP7NLW0yH/slO2Tl2qnffXGNS1HOhuhhi2KUrHaEzADPUbDY0bUb0zn7FprTTiQHnIRcO1psw==";
const BASE_URL_AREACODE = "http://apis.data.go.kr/B551011/KorService1/areaCode1";
const BASE_URL_AREABASED_LIST = "http://apis.data.go.kr/B551011/KorService1/areaBasedList1";
let isFirst = true;
let title = "";
$(() => {
  getAreaCode();
  getItemList();
  $(document).on('change', '.areaCode_radio', function() {
    $("#small_areaCode").hide();
    $(".title-hash").html($(this)[0].classList[1]);
    if(isFirst) {
      getAreaCode();
      getItemList();
    }else {
      $("input:radio[name=sigungu]").prop("checked", false);
      getAreaCode();
      getItemList();
    }
  })

  $(document).on('change', '.areaCode_radio2', function() {
    getItemList();
  })
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
      showAndHideSpinner("show");
    },
    complete : function() {
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
                        <input type="radio" class="areaCode_checkbox" name="sigungu" id="all_small" value="" checked>
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

function getItemList() {
  let area = $("input:radio[name=areaCode]:checked").val();
  let sigungu = $("input:radio[name=sigungu]:checked").val();
  area == "undefiend" ? area="" : $("input:radio[name=areaCode]:checked").val();
  sigungu == "undefiend" ? sigungu="" : $("input:radio[name=sigungu]:checked").val();
  console.log(area, sigungu)
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
    numOfRows: 10,
    pageNo: 1,
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
      renderList(response.response);
      console.log(response);
    },
    error: function(error) {
      console.log(error);
      console.log(error.responseText);
    },
    beforeSend: function() {
      showAndHideSpinner("show");
      console.log("!!")
    },
    complete : function() {
      showAndHideSpinner("hide");
      console.log("!!!")
    }
    
  });
}

function renderList(items) {
  let itemArr = items.body.items.item;
  $("#count").html(`${parseInt(items.body.totalCount).toLocaleString()}`);
  let template = "";
  for(let item of itemArr) {
    template += `
      <li class="course-lists py-3 border-bottom border-2">
        <div class="row list-content">
          <div class="col-3 list-image">
            <img src="${item.firstimage2}" class="img-fluid w-100">
          </div>
          <div class="col-9 list-content-content">
            <h5 class="text-truncate"><a href="./detail.html?contentId=${item.contentid}">${item.title}</a>
            <p></p>
          </div>
        </div>
      </li>
    `
  }
  $(".course").html(template);
}

function showAndHideSpinner(e) {
  e == "show" ? $(".spinner_back").css("visibility", "visible") : $(".spinner_back").css("visibility", "hidden");
}