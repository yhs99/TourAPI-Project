let contentId = new URLSearchParams(location.search).get("contentId");

window.onload = () => {
  console.log(contentId);
}