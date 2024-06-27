
$("#searchByMyLocation").on("click", function() {
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {enableHighAccuray : false});
});

function geoSuccess(geo) {
  if(!geo) {
    geoError({code: 1});
    return;
  }
  currentSearch = "searchByLocation";
  pos = geo.coords;
  getItemListByLocation();
  $("#modal-close").click();
}

function getItemListByLocation(isAppend=false) {
  let params = {
    numOfRows : numOfRows,
    pageNo : pageNo,
    MobileOS : "ETC",
    MobileApp : "TestApp",
    _type : "json",
    listYN : "Y",
    mapX: pos.longitude,
    mapY: pos.latitude,
    radius : 20000,
    contentTypeId: contentTypeId,
    serviceKey: API_KEY
  }

  $.ajax({
    url: BASE_URL_LOCATION,
    data: params,
    type: "get",
    dataType: "json",
    success : function(response) {
      console.log(response);
      renderList(response.response, isAppend);
    },
    error : function(error) {

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

function geoError(err) {
  if(err.code === 1) {
    alert("위치정보 제공을 허용해주세요.");
  }else {
    alert("오류가 발생했습니다.");
  }
  console.warn(`ERROR(${err.code}): ${err.message}`);
}