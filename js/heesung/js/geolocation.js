
$("#searchByMyLocation").on("click", function() {
  pageNo=1;
  isLastPage=false;
  $("input:radio[name=areaCode]").eq(0).prop("checked", true);
  $("#small_areaCode").slideUp()
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError, {enableHighAccuray : false});
});
/**
 * 사용자의 위치정보를 가져와 데이터 요청 함수를 실행합니다
 * 위치정보를 가져올 수 없으면 error를 핸들링합니다
 * @param {*} geo 
 * @returns 
 */
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
/**
 * 위치 기반의 리스트 목록 데이터를 요청합니다.
 * @param {boolean} isAppend 
 */
function getItemListByLocation(isAppend=false) {
  let sort = $("input:radio[name=sort_radio]:checked").val();
  let params = {
    arrange: sort,
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
  })

}
/**
 * 위치정보 에러 핸들링 함수
 * @param {Object} err 
 */
function geoError(err) {
  if(err.code === 1) {
    alert("위치정보 제공을 허용해주세요.");
  }else {
    alert("오류가 발생했습니다.");
  }
  console.warn(`ERROR(${err.code}): ${err.message}`);
}