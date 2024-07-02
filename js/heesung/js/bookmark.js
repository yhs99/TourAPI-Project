function addBookMark(contentid, title, imgUrl, link, el) {
  let favObj = !Cookies.get("favorite_post") ? {} : JSON.parse(Cookies.get("favorite_post"));
  
  let data = {[contentid] : {
    postimage: imgUrl,
    title: title,
    link: link
  }};
  
  if(!favObj) {
    document.cookie=`favorite_post="${JSON.stringify(data)}`;
  }else if(favObj.hasOwnProperty(contentid)){
    delete favObj[contentid];
    document.cookie=`favorite_post=${JSON.stringify(favObj)}`;
  } else {
    Object.keys(favObj).forEach(e => {
      data[e] = favObj[e];
    });
    document.cookie=`favorite_post=${JSON.stringify(data)}`;
  }
  
  renderBookMark(el, contentid);
}

function checkBookMark(id) {
  let favObj = !Cookies.get("favorite_post")? {} : JSON.parse(Cookies.get("favorite_post"));
  let flag = false;
  if(!favObj.hasOwnProperty(id)) {
    flag = false;
  }else {
    flag = true;
  }
  return flag;
}
 
function renderBookMark(el, contentid) {
  if(checkBookMark(contentid)) {
    $(el).addClass("bi-balloon-heart-fill").removeClass("bi-balloon-heart");
  }else {
    $(el).addClass("bi-balloon-heart").removeClass("bi-balloon-heart-fill");
  }
}