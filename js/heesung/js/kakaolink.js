function shareLink() {
  Kakao.Share.createDefaultButton({
    container: '#kakaotalk-sharing-btn',
    objectType: 'feed',
    content: {
      title: defaultInfo.title,
      description: defaultInfo.overview,
      imageUrl:
        defaultInfo.firstimage2,
      link: {
        // [내 애플리케이션] > [플랫폼] 에서 등록한 사이트 도메인과 일치해야 함
        mobileWebUrl: location.origin,
        webUrl: location.origin,
      },
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          mobileWebUrl: location.href,
          webUrl: location.href,
        },
      }
    ],
  });
}