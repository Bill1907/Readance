// 확장 프로그램이 설치될 때 실행
chrome.runtime.onInstalled.addListener(function () {
  // 기본 설정 초기화
  chrome.storage.sync.set(
    {
      settings: {
        enabled: true,
        theme: "light",
        fontSize: 16,
      },
      bookmarks: [], // 빈 북마크 배열 초기화
    },
    function () {
      console.log("Default settings initialized");
    }
  );

  // 사이드 패널 설정
  if (chrome.sidePanel) {
    chrome.sidePanel.setOptions({
      path: "sidepanel.html",
      enabled: true,
    });
  }
});

// 확장 프로그램 아이콘 클릭 핸들러 - 사이드 패널 열기
chrome.action.onClicked.addListener((tab) => {
  // 사이드 패널 API가 있는 경우
  if (chrome.sidePanel) {
    chrome.sidePanel.open({ tabId: tab.id });
  }
});

// 백그라운드에서 탭 간 메시지 전달 처리
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "getSettings") {
    chrome.storage.sync.get(["settings"], function (result) {
      sendResponse({ settings: result.settings });
    });
    return true; // 비동기 응답을 위해 true 반환
  }

  // 북마크 추가 처리
  if (message.action === "addBookmark") {
    chrome.storage.sync.get(["bookmarks"], function (result) {
      const bookmarks = result.bookmarks || [];

      // 중복 북마크 확인
      const isDuplicate = bookmarks.some((b) => b.url === message.bookmark.url);

      if (!isDuplicate) {
        bookmarks.push(message.bookmark);
        chrome.storage.sync.set({ bookmarks: bookmarks }, function () {
          sendResponse({ success: true, message: "북마크가 저장되었습니다." });
        });
      } else {
        sendResponse({ success: false, message: "이미 저장된 북마크입니다." });
      }
    });
    return true;
  }

  // 북마크 삭제 처리
  if (message.action === "removeBookmark") {
    chrome.storage.sync.get(["bookmarks"], function (result) {
      const bookmarks = result.bookmarks || [];
      const filteredBookmarks = bookmarks.filter((b) => b.url !== message.url);

      chrome.storage.sync.set({ bookmarks: filteredBookmarks }, function () {
        sendResponse({ success: true });
      });
    });
    return true;
  }
});
