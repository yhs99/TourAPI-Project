/**
 * 
 * @param {number} contentid 게시물 contentid
 * @param {string} title 게시물 제목
 * @param {URL} imgUrl 리스트에 보여줄 image URL
 * @param {URL} link 게시물의 상세 페이지를 보여줄 link
 * @param {HTMLElement} el 찜 효과를 줄 html element 아이콘태그
 *  
 */
function addBookMark(contentid, title, imgUrl, link, el) {
  let favObj = !Cookies.get("favorite_post") ? {} : JSON.parse(Cookies.get("favorite_post"));
  
  if(!favObj) { // 쿠키가 없을 때,
    let data = {[contentid] : {
      postimage: imgUrl,
      title: title,
      link: link
    }};
    document.cookie=`favorite_post="${JSON.stringify(data)}`;
  }else if(favObj.hasOwnProperty(contentid)){ // 쿠키가 존재하여 해당 contentid 객체를 제거함.
    delete favObj[contentid];
    document.cookie=`favorite_post=${JSON.stringify(favObj)}`;
  } else { // contentid가 없으므로 contentid의 객체를 추가함. 
    favObj[contentid] ={
      postimage: imgUrl,
      title: title,
      link: link
    };
    document.cookie=`favorite_post=${JSON.stringify(favObj)}`;
  }
  
  renderBookMark(el, contentid);
}

/**
 * 해당 게시물의 찜 여부를 boolean으로 반환합니다
 * @param {number} id 찜 여부를 판단할 게시물 contentid
 * @returns 
 */
function checkBookMark(id) {
  let favObj = !Cookies.get("favorite_post")? {} : JSON.parse(Cookies.get("favorite_post"));
  return favObj.hasOwnProperty(id);
}

/**
 * 게시물의 찜 여부를 판단 후 html element의 class를 수정하여 찜 효과를 생성합니다
 * @param {HTMLElement} el 찜 효과를 줄 html element
 * @param {number} contentid 찜 여부를 판단할 게시물 contentid
 */
function renderBookMark(el, contentid) {
  if(checkBookMark(contentid)) {
    $(el).addClass("bi-balloon-heart-fill").removeClass("bi-balloon-heart");
  }else {
    $(el).addClass("bi-balloon-heart").removeClass("bi-balloon-heart-fill");
  }
}