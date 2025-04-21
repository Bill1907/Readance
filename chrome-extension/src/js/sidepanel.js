// 사이드 패널 스크립트

document.addEventListener("DOMContentLoaded", function () {
  // 요소 참조
  const analyzeBtn = document.getElementById("analyzeBtn");
  const readModeBtn = document.getElementById("readModeBtn");
  const themeSelect = document.getElementById("theme");
  const fontSizeInput = document.getElementById("fontSize");
  const fontSizeValue = document.getElementById("fontSizeValue");
  const pageStats = document.getElementById("pageStats");
  const bookmarkList = document.getElementById("bookmarkList");

  // 설정 로드
  loadSettings();

  // 폰트 크기 슬라이더 이벤트
  fontSizeInput.addEventListener("input", function () {
    fontSizeValue.textContent = this.value + "px";
  });

  // 테마 변경 이벤트
  themeSelect.addEventListener("change", function () {
    saveSettings();
  });

  // 폰트 크기 변경 이벤트
  fontSizeInput.addEventListener("change", function () {
    saveSettings();
  });

  // 페이지 분석 버튼 클릭 이벤트
  analyzeBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        analyzeCurrentPage(tabs[0].id);
      }
    });
  });

  // 읽기 모드 버튼 클릭 이벤트
  readModeBtn.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0]) {
        enableReaderMode(tabs[0].id);
      }
    });
  });

  // 설정 로드 함수
  function loadSettings() {
    chrome.storage.sync.get(["settings"], function (result) {
      if (result.settings) {
        themeSelect.value = result.settings.theme;
        fontSizeInput.value = result.settings.fontSize;
        fontSizeValue.textContent = result.settings.fontSize + "px";
      }
    });

    // 북마크 로드
    loadBookmarks();
  }

  // 설정 저장 함수
  function saveSettings() {
    const settings = {
      theme: themeSelect.value,
      fontSize: parseInt(fontSizeInput.value, 10),
      enabled: true, // 기본값
    };

    chrome.storage.sync.set({ settings: settings }, function () {
      console.log("Settings saved:", settings);
    });
  }

  // 현재 페이지 분석 함수
  function analyzeCurrentPage(tabId) {
    // 로딩 상태 표시
    pageStats.innerHTML = "<p>페이지 분석 중...</p>";

    // 콘텐츠 스크립트에 분석 메시지 전송
    chrome.tabs.sendMessage(tabId, { action: "analyze" }, function (response) {
      if (response && response.stats) {
        displayPageStats(response.stats);
      } else {
        pageStats.innerHTML = "<p>페이지 분석에 실패했습니다.</p>";
      }
    });
  }

  // 페이지 통계 표시 함수
  function displayPageStats(stats) {
    pageStats.innerHTML = `
      <div>
        <p><strong>단어 수:</strong> ${stats.wordCount}</p>
        <p><strong>예상 읽기 시간:</strong> ${stats.readingTime}분</p>
        <p><strong>문단 수:</strong> ${stats.paragraphCount}</p>
        <p><strong>이미지 수:</strong> ${stats.imageCount}</p>
      </div>
    `;
  }

  // 읽기 모드 활성화 함수
  function enableReaderMode(tabId) {
    // 현재 설정 가져오기
    chrome.storage.sync.get(["settings"], function (result) {
      // 콘텐츠 스크립트에 읽기 모드 메시지 전송
      chrome.tabs.sendMessage(tabId, {
        action: "start",
        settings: result.settings,
      });
    });
  }

  // 북마크 로드 함수
  function loadBookmarks() {
    chrome.storage.sync.get(["bookmarks"], function (result) {
      if (result.bookmarks && result.bookmarks.length > 0) {
        displayBookmarks(result.bookmarks);
      } else {
        bookmarkList.innerHTML = "<p>저장된 북마크가 없습니다.</p>";
      }
    });
  }

  // 북마크 표시 함수
  function displayBookmarks(bookmarks) {
    bookmarkList.innerHTML = "";

    bookmarks.forEach(function (bookmark, index) {
      const bookmarkItem = document.createElement("div");
      bookmarkItem.className = "bookmark-item";
      bookmarkItem.innerHTML = `
        <div class="bookmark-title">${bookmark.title}</div>
        <div class="bookmark-url">${bookmark.url}</div>
      `;

      // 북마크 클릭 이벤트 - 해당 페이지 열기
      bookmarkItem.addEventListener("click", function () {
        chrome.tabs.create({ url: bookmark.url });
      });

      bookmarkList.appendChild(bookmarkItem);
    });
  }
});
