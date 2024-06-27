
$("#searchByMyLocation").on("click", function() {
  console.log("clicked");
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
    alert("")
  }
  console.warn(`ERROR(${err.code}): ${err.message}`);
}