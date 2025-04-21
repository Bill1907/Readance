// 설정 페이지 스크립트

// DOM 로드 시 설정 불러오기 및 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", function () {
  // 요소 참조
  const enabledSelect = document.getElementById("enabled");
  const themeSelect = document.getElementById("theme");
  const fontSizeInput = document.getElementById("fontSize");
  const fontSizeValue = document.getElementById("fontSizeValue");
  const saveButton = document.getElementById("saveBtn");
  const statusDiv = document.getElementById("status");

  // 설정 불러오기
  loadSettings();

  // 폰트 크기 슬라이더 값 표시
  fontSizeInput.addEventListener("input", function () {
    fontSizeValue.textContent = this.value;
  });

  // 저장 버튼 클릭 이벤트
  saveButton.addEventListener("click", function () {
    saveSettings();
  });

  // 설정 불러오기 함수
  function loadSettings() {
    chrome.storage.sync.get(["settings"], function (result) {
      if (result.settings) {
        // UI에 설정 값 표시
        enabledSelect.value = result.settings.enabled.toString();
        themeSelect.value = result.settings.theme;
        fontSizeInput.value = result.settings.fontSize;
        fontSizeValue.textContent = result.settings.fontSize;

        console.log("Settings loaded:", result.settings);
      }
    });
  }

  // 설정 저장 함수
  function saveSettings() {
    // UI에서 설정 값 가져오기
    const settings = {
      enabled: enabledSelect.value === "true",
      theme: themeSelect.value,
      fontSize: parseInt(fontSizeInput.value, 10),
    };

    // 설정 저장
    chrome.storage.sync.set({ settings: settings }, function () {
      console.log("Settings saved:", settings);

      // 저장 완료 메시지 표시
      statusDiv.style.visibility = "visible";
      setTimeout(function () {
        statusDiv.style.visibility = "hidden";
      }, 1500);
    });
  }
});
