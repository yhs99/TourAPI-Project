var client_id = 'wfN06JxVRdtNieewzFF0';
var client_secret = 'Pv6Oop7A_N';

if(location.port=="") {
  getNaverShortUrl();
};

function getNaverShortUrl() {
  let api_url = 'https://openapi.naver.com/v1/util/shorturl.json';
  $.ajax({
    type: "get",
    data: {url:location.href},
    url: api_url,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
      xhr.setRequestHeader("X-Naver-Client-Id", client_id);
      xhr.setRequestHeader("X-Naver-Client-Secret", client_secret);
    },
    success: function(response) {
      console.log(response);
    },
    error: function(error) {
      console.error(error);
      console.error(error.responseText);
    }
  })
}