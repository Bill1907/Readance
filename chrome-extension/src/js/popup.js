document.addEventListener("DOMContentLoaded", function () {
  // DOM이 로드되면 실행되는 코드
  const startBtn = document.getElementById("startBtn");
  const sidePanelBtn = document.getElementById("sidePanelBtn");
  const analyzeBtn = document.getElementById("analyzeBtn");

  // 읽기 모드 버튼 클릭 이벤트 리스너
  startBtn.addEventListener("click", function () {
    // 현재 활성화된 탭에 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "start" },
        function (response) {
          console.log(response);
          // 팝업 닫기
          window.close();
        }
      );
    });
  });

  // 사이드 패널 열기 버튼 클릭 이벤트 리스너
  sidePanelBtn.addEventListener("click", function () {
    // 현재 활성화된 탭에 대해 사이드 패널 열기
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (chrome.sidePanel) {
        chrome.sidePanel.open({ tabId: tabs[0].id });
        // 팝업 닫기
        window.close();
      }
    });
  });

  // 페이지 분석 버튼 클릭 이벤트 리스너
  analyzeBtn.addEventListener("click", function () {
    // 현재 활성화된 탭에 메시지 전송
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: "analyze" },
        function (response) {
          if (response && response.stats) {
            // 페이지 통계 정보 표시
            alert(`
              단어 수: ${response.stats.wordCount}
              예상 읽기 시간: ${response.stats.readingTime}분
              문단 수: ${response.stats.paragraphCount}
              이미지 수: ${response.stats.imageCount}
            `);
          } else {
            alert("페이지 분석에 실패했습니다.");
          }
          // 팝업 닫기
          window.close();
        }
      );
    });
  });

  // 저장된 설정 불러오기
  chrome.storage.sync.get(["settings"], function (result) {
    if (result.settings) {
      console.log("Settings loaded:", result.settings);
      // 설정에 따라 UI 업데이트
    }
  });
});
