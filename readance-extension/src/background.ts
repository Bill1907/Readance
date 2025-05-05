// 타입 정의
interface Settings {
  enabled: boolean;
  autoSave: boolean;
  theme: string;
}

interface Message {
  action: string;
  text?: string;
  query?: string;
  bookmark?: {
    title: string;
    url: string;
    date: string;
  };
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

// 확장 프로그램 설치 시 실행
chrome.runtime.onInstalled.addListener(() => {
  console.log("Readance extension installed");

  // 기본 설정 초기화
  const defaultSettings: Settings = {
    enabled: true,
    autoSave: true,
    theme: "light",
  };

  chrome.storage.sync.set({
    settings: defaultSettings,
  });

  // 사이드 패널 설정
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

  // 컨텍스트 메뉴 생성
  chrome.contextMenus.create({
    id: "readanceSearch",
    title: "Search with Readance",
    contexts: ["selection"],
  });
});

// 컨텍스트 메뉴 클릭 이벤트 리스너
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "readanceSearch" && info.selectionText) {
    // 선택된 텍스트를 스토리지에 저장
    chrome.storage.local.set({ selectedText: info.selectionText });

    // 선택된 텍스트로 검색 수행
    performSearch(info.selectionText);
  }
});

// 검색 수행 함수
async function performSearch(query: string): Promise<void> {
  try {
    // 사이드 패널 열기
    chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });

    // 로컬 스토리지에 현재 검색어 저장
    chrome.storage.local.set({
      currentSearchQuery: query,
      selectedText: query, // 선택된 텍스트와 검색어를 동기화
    });

    // 검색 API 호출
    const searchUrl = `http://localhost:3000/search?query=${encodeURIComponent(query)}`;

    // 검색 결과를 저장
    chrome.storage.local.set({
      searchStatus: "searching",
      lastSearchQuery: query,
    });

    // 실제 API 호출 시 아래 코드 사용
    try {
      const response = await fetch(searchUrl);

      if (!response.ok) {
        throw new Error("Search API request failed");
      }
      const data = await response.json();

      if (data.success) {
        console.log("API 호출 응답:", data.response.results);

        chrome.storage.local.set({
          searchResults: data.response.results || [],
          searchStatus: "completed",
        });
      } else {
        throw Error("Search API request failed");
      }
    } catch (error) {
      console.error("API 호출 오류:", error);

      // 임시 검색 결과 (API 미구현 상태에서 테스트용)
      const mockResults: SearchResult[] = [
        {
          title: "Readance: Enhanced Reading Experience",
          url: "https://example.com/readance",
          snippet: `Your search for "${query}" matches our tutorial on enhanced reading...`,
        },
        {
          title: `Search results for "${query}"`,
          url: "https://example.com/search",
          snippet:
            "Learn more about the topics you're interested in with Readance...",
        },
        {
          title: "Knowledge Base",
          url: "https://example.com/knowledge",
          snippet: `Resources and information related to "${query}" and other topics...`,
        },
      ];

      chrome.storage.local.set({
        searchResults: mockResults,
        searchStatus: "completed",
      });
    }
  } catch (error) {
    console.error("검색 처리 오류:", error);
    chrome.storage.local.set({
      searchStatus: "error",
      searchError: (error as Error).message,
    });
  }
}

// 콘텐츠 스크립트로부터 메시지 수신
chrome.runtime.onMessage.addListener(
  (message: Message, sender, sendResponse) => {
    if (message.action === "getSettings") {
      // 설정 데이터 전송
      chrome.storage.sync.get("settings", (data) => {
        sendResponse({ settings: data.settings });
      });
      return true; // 비동기 응답을 위해 true 반환
    }

    if (message.action === "textSelected" && message.text) {
      console.log("선택된 텍스트:", message.text);
      // 선택된 텍스트를 스토리지에 저장
      chrome.storage.local.set({ selectedText: message.text });
      sendResponse({ status: "success" });
      return true;
    }

    if (message.action === "performSearch" && message.query) {
      console.log("검색 요청:", message.query);
      // 검색 수행
      performSearch(message.query);
      sendResponse({ status: "searching" });
      return true;
    }

    if (message.action === "addBookmark" && message.bookmark) {
      console.log("북마크 추가:", message.bookmark);
      // 북마크 추가 로직
      chrome.storage.local.get({ readanceBookmarks: [] }, (result) => {
        const bookmarks = result.readanceBookmarks;
        bookmarks.push(message.bookmark);
        chrome.storage.local.set({ readanceBookmarks: bookmarks }, () => {
          sendResponse({ status: "success" });
        });
      });
      return true;
    }

    if (message.action === "openSidePanel") {
      chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
      sendResponse({ status: "success" });
      return true;
    }

    return false;
  }
);
