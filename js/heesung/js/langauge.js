/**
 * localstorage 값을 변경해 언어 설정을 변경합니다.
 * @param {string} lang ko | en
 */
function changeLang(lang) {
  localStorage.setItem("language", lang);
  location.reload();
}