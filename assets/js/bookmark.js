function addBookMark(title, id, el) {
  let key = id;
  let item = title;
  if(checkBookMark(id)) {
    localStorage.removeItem(key);
    $(el).removeClass("bi-balloon-heart-fill").addClass("bi-balloon-heart");
  }else {
    localStorage.setItem(key, JSON.stringify(item));
    $(el).removeClass("bi-balloon-heart").addClass("bi-balloon-heart-fill");
  }
}

function checkBookMark(id) {
  let flag = false;
  Object.keys(localStorage).forEach((value, index) => {
    if(value === id.toString()) {
      flag=true;
    }
  });
  return flag;
}