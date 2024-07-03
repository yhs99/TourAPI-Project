$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
  let error = options.error;
  options.error = function (jqXHR, textStatus, errorThrown) {
      
      // location.href = './error.html?errorCode=500'
      // 전역 에러 해들링을 수행한다.
      // 만약에 $.ajax(...) 에서 error 메소드를 할당하지 않았다면
      // 이 if 문 안으로 들어가지 않는다. 
      if (typeof error === 'function') {
        alert("통신에러");
          // 만약에 그냥 local error handler 를 호출하고 싶지 않다면 아래
          // 문장도 쓰지 않으면 된다.
          //return $.proxy(error, this)(jqXHR, textStatus, errorThrown);
      }
    
  };
});