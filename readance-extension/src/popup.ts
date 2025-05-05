document.addEventListener("DOMContentLoaded", function () {
  // 현재 페이지 북마크 버튼
  const bookmarkBtn = document.getElementById("bookmark-btn");
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener("click", function () {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].id) {
          chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "addCurrentPageBookmark" },
            function (response) {
              console.log("북마크 추가 응답:", response);
              if (response && response.status === "success") {
                alert("페이지가 북마크에 추가되었습니다!");
              }
            }
          );
        }
      });
    });
  }

  // 옵션 페이지 열기 버튼
  const optionsBtn = document.getElementById("options-btn");
  if (optionsBtn) {
    optionsBtn.addEventListener("click", function () {
      chrome.runtime.openOptionsPage();
    });
  }
});
