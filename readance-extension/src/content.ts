// 타입 정의
interface Settings {
  enabled: boolean;
  autoSave: boolean;
  theme: string;
}

interface Message {
  action: string;
  settings?: Settings;
  status?: string;
  text?: string;
  query?: string;
}

interface Bookmark {
  title: string;
  url: string;
  date: string;
}

// 페이지에 삽입되는 콘텐츠 스크립트

// 설정 가져오기
let settings: Settings = {
  enabled: true,
  autoSave: true,
  theme: "light",
};

chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
  if (response && response.settings) {
    settings = response.settings;
    console.log("Content script received settings:", settings);
  }
});

// 텍스트 선택 이벤트 리스너
document.addEventListener("mouseup", handleTextSelection);

// 미니 팝업 요소 생성
const miniPopup = document.createElement("div");
miniPopup.id = "readance-mini-popup";
miniPopup.style.position = "absolute";
miniPopup.style.zIndex = "9999";
miniPopup.style.backgroundColor = "white";
miniPopup.style.borderRadius = "4px";
miniPopup.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.2)";
miniPopup.style.padding = "8px";
miniPopup.style.display = "none";
miniPopup.innerHTML = `
  <button id="readance-search-btn" style="
    background-color: #4285f4;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  ">Search with Readance</button>
`;
document.body.appendChild(miniPopup);

// 검색 버튼 클릭 이벤트 리스너
document
  .getElementById("readance-search-btn")
  ?.addEventListener("click", () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() || "";

    if (selectedText.length > 0) {
      // 선택된 텍스트를 스토리지에 저장
      chrome.storage.local.set({ selectedText: selectedText });
      performSearch(selectedText);
      hideMiniPopup();
    }
  });

// 텍스트 선택 처리 함수
function handleTextSelection(event: MouseEvent): void {
  if (!settings.enabled) return;

  const selection = window.getSelection();
  const selectedText = selection?.toString().trim() || "";

  // 선택된 텍스트가 있는 경우에만 처리
  if (selectedText.length > 0) {
    // 미니 팝업 표시
    showMiniPopup(event);

    // 선택된 텍스트를 스토리지에 저장
    chrome.storage.local.set({ selectedText: selectedText });

    // 자동 저장 설정이 켜져 있을 때만 자동으로 저장
    if (settings.autoSave) {
      // 배경 스크립트에 선택된 텍스트 전송
      chrome.runtime.sendMessage(
        {
          action: "textSelected",
          text: selectedText,
        },
        (response) => {
          console.log("텍스트 선택 메시지 전송 완료:", response);
        }
      );
    }
  } else {
    // 선택된 텍스트가 없으면 미니 팝업 숨기기
    hideMiniPopup();
  }
}

// 미니 팝업 표시 함수
function showMiniPopup(event: MouseEvent): void {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // 팝업 위치 설정 (선택된 텍스트 상단에 표시)
  miniPopup.style.left = `${window.scrollX + rect.left + rect.width / 2 - 75}px`;
  miniPopup.style.top = `${window.scrollY + rect.top - 45}px`;
  miniPopup.style.display = "block";
}

// 미니 팝업 숨기기 함수
function hideMiniPopup(): void {
  miniPopup.style.display = "none";
}

// 검색 함수
function performSearch(query: string): void {
  chrome.runtime.sendMessage(
    {
      action: "performSearch",
      query: query,
    },
    (response) => {
      console.log("검색 요청 전송 완료:", response);
    }
  );
}

// 클릭 이벤트 리스너 (미니 팝업 외부 클릭 시 닫기)
document.addEventListener("click", (event) => {
  if (event.target instanceof Node && !miniPopup.contains(event.target)) {
    hideMiniPopup();
  }
});

// 팝업 또는 사이드 패널로부터 메시지 수신
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    // 현재 페이지 북마크 추가
    if (message.action === "addCurrentPageBookmark") {
      const bookmark: Bookmark = {
        title: document.title,
        url: window.location.href,
        date: new Date().toISOString(),
      };

      chrome.runtime.sendMessage(
        {
          action: "addBookmark",
          bookmark: bookmark,
        },
        (response) => {
          sendResponse(response);
        }
      );

      return true;
    }

    // 선택된 텍스트 요청에 응답
    if (message.action === "getSelectedText") {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim() || "";
      sendResponse({ selectedText: selectedText });
      return true;
    }

    sendResponse({ status: "ok" });
    return true;
  }
);
