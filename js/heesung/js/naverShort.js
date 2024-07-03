var client_id = 'wfN06JxVRdtNieewzFF0';
var client_secret = 'Pv6Oop7A_N';

getNaverShortUrl();
function getNaverShortUrl() {
  let api_url = 'https://openapi.naver.com/v1/util/shorturl.json';
  let options = {url:location.href};

  $.ajax({
    type: "get",
    data: options,
    dataType: "json",
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