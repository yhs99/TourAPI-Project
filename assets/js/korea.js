let sido = {
  seoul : "서울",
  busan : "부산",
  daegu : "대구",
  incheon : "인천",
  gwangju : "광주",
  daejeon : "대전",
  ulsan : "울산",
  sejong : "세종",
  gyeonggi : "경기도",
  chungbuk : "충청북도",
  chungnam : "충청남도",
  jeonbuk : "전라북도",
  jeonnam : "전라남도",
  gyeongbuk : "경상북도",
  gyeongnam : "경상남도",
  jeju : "제주도",
  gangwon : "강원도"
}

window.onload = () => {
  loadSVG();
  
}

function loadSVG() {
  let svgDiv = document.getElementById("modal-body");
  let mime = "image/svg+xml";
  $.ajax({
    url: "./assets/img/Korea.svg",
    dataType: "text",
    success: function(response) {
      //console.log(response);
      const svgElement = new DOMParser().parseFromString(response, mime).documentElement;
      svgDiv.appendChild(svgElement);

      const paths = svgElement.querySelectorAll('path');
      for(const path of paths) {
        path.addEventListener('click', function() {
          isLastPage=false;
          pageNo=1;
          $(`#${this.id}`).prop("checked", true);
          $(".title-hash").html("#"+$(`#${this.id}`)[0].classList[1]);
          $("input:radio[name=sigungu]").prop("checked", false);
          getItemListByAreaCode();
          getAreaCode();
          document.getElementById("modal-close").click();
        });
        path.addEventListener('mouseover', function() {
          $(this).attr("fill", "#ffffff");
        });
        path.addEventListener('mouseleave', function() {
          $(this).attr("fill", "#FF99CC");
        });
      }
    },
    error : function(error) {
      console.log(error);
    }
  })
}