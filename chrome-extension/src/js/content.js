// 페이지에 삽입되는 콘텐츠 스크립트

// 설정 가져오기
let settings = {};
chrome.runtime.sendMessage({ action: "getSettings" }, function (response) {
  if (response && response.settings) {
    settings = response.settings;
    console.log("Content script received settings:", settings);
  }
});

// 팝업 또는 사이드 패널로부터 메시지 수신
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // 읽기 모드 활성화
  if (message.action === "start") {
    // 메시지에 설정이 포함된 경우 설정 업데이트
    if (message.settings) {
      settings = message.settings;
    }

    // 리더 모드 활성화
    enableReaderMode();
    sendResponse({ status: "Reader mode activated" });
  }

  // 페이지 분석
  else if (message.action === "analyze") {
    const stats = analyzePageContent();
    sendResponse({ stats: stats });
  }

  // 현재 페이지 북마크 추가
  else if (message.action === "addCurrentPageBookmark") {
    const bookmark = {
      title: document.title,
      url: window.location.href,
      date: new Date().toISOString(),
    };

    chrome.runtime.sendMessage(
      {
        action: "addBookmark",
        bookmark: bookmark,
      },
      function (response) {
        sendResponse(response);
      }
    );

    return true;
  }

  return true;
});

// 페이지 콘텐츠 분석 함수
function analyzePageContent() {
  const mainContent = findMainContent();
  let text = "";

  if (mainContent) {
    text = mainContent.textContent;
  } else {
    text = document.body.textContent;
  }

  // 단어 수 계산
  const wordCount = text.split(/\s+/).filter((word) => word.length > 0).length;

  // 평균 읽기 속도 (분당 200단어로 가정)
  const readingTime = Math.ceil(wordCount / 200);

  // 문단 수 계산 (p 태그)
  const paragraphCount = document.querySelectorAll("p").length;

  // 이미지 수 계산
  const imageCount = document.querySelectorAll("img").length;

  return {
    wordCount,
    readingTime,
    paragraphCount,
    imageCount,
  };
}

// 리더 모드 기능 구현
function enableReaderMode() {
  // 페이지 내용 분석
  const mainContent = findMainContent();

  if (mainContent) {
    // 페이지 스타일 변경
    applyReadingStyles(mainContent);
  } else {
    console.log("Main content not found");
  }
}

// 주요 콘텐츠 찾기 (간단한 구현)
function findMainContent() {
  // 이 부분은 실제로는 더 복잡한 알고리즘이 필요함
  // 여기서는 간단한 예시만 제공
  const possibleContainers = [
    document.querySelector("article"),
    document.querySelector("main"),
    document.querySelector(".content"),
    document.querySelector(".post-content"),
    document.querySelector("#content"),
  ];

  for (const container of possibleContainers) {
    if (container && container.textContent.length > 500) {
      return container;
    }
  }

  // 적절한 컨테이너를 찾지 못한 경우 본문에 가장 많은 텍스트가 있는 div 찾기
  const bodyDivs = document.querySelectorAll("body div");
  let maxTextLength = 0;
  let maxTextDiv = null;

  for (const div of bodyDivs) {
    if (div.textContent.length > maxTextLength) {
      maxTextLength = div.textContent.length;
      maxTextDiv = div;
    }
  }

  return maxTextDiv;
}

// 읽기 모드 스타일 적용
function applyReadingStyles(element) {
  // 원래 페이지의 내용을 저장
  const originalContent = element.innerHTML;

  // 새로운 스타일 적용을 위한 컨테이너 생성
  const readerContainer = document.createElement("div");
  readerContainer.id = "readance-container";
  readerContainer.innerHTML = originalContent;

  // 스타일 적용
  readerContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${settings.theme === "dark" ? "#222" : "#fff"};
    color: ${settings.theme === "dark" ? "#eee" : "#333"};
    padding: 2rem;
    overflow-y: auto;
    font-family: Georgia, serif;
    font-size: ${settings.fontSize}px;
    line-height: 1.6;
    z-index: 9999;
  `;

  // 북마크 버튼 추가
  const bookmarkButton = document.createElement("button");
  bookmarkButton.textContent = "북마크";
  bookmarkButton.style.cssText = `
    position: fixed;
    top: 10px;
    right: 50px;
    background: none;
    border: 1px solid ${settings.theme === "dark" ? "#eee" : "#333"};
    color: ${settings.theme === "dark" ? "#eee" : "#333"};
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    z-index: 10000;
  `;

  bookmarkButton.addEventListener("click", function () {
    chrome.runtime.sendMessage(
      {
        action: "addBookmark",
        bookmark: {
          title: document.title,
          url: window.location.href,
          date: new Date().toISOString(),
        },
      },
      function (response) {
        if (response && response.success) {
          alert("북마크가 저장되었습니다.");
        } else if (response) {
          alert(response.message);
        }
      }
    );
  });

  // 닫기 버튼 추가
  const closeButton = document.createElement("button");
  closeButton.textContent = "✕";
  closeButton.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: ${settings.theme === "dark" ? "#eee" : "#333"};
    font-size: 20px;
    cursor: pointer;
    z-index: 10000;
  `;

  closeButton.addEventListener("click", function () {
    document.body.removeChild(readerContainer);
    document.body.removeChild(closeButton);
    document.body.removeChild(bookmarkButton);
  });

  // 페이지에 추가
  document.body.appendChild(readerContainer);
  document.body.appendChild(closeButton);
  document.body.appendChild(bookmarkButton);
}
