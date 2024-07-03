var areaCodeObj;
areaCodeMatchfn();
function areaCodeMatchfn() {
  $.ajax({
    url: './js/heesung/js/areacode.json',
    type: "get",
    dataType: "json",
    success: function(response) {
      areaCodeObj = response;
    },
    error: function(error) {
      console.error("areacode matching error");
      console.log(error);
    }
  })
}

function isMatchAreaCode(areaC) {
  let area="";
  areaCodeObj.forEach(element => {
    if(element.code == areaC) {
      area = element.name;
    }
  });
  return area;
}

function isMatchSigunguCode(areaC, sigunguC) {
  let area="";
  areaCodeObj.forEach(element => {
    if(element.code == areaC) {
      for(let e of element.sigungu) {
        if(e.code == sigunguC) {
          area = e.name;
        }
      }
    }
  });
  return area;
}