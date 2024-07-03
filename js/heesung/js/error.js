$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  let error = options.error;
  options.error = function (jqXHR, textStatus, errorThrown) {
      // 전역 에러 해들링을 수행한다.
      location.href = './error.html?errorCode=500'
  };
});