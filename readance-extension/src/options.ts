document.addEventListener("DOMContentLoaded", function () {
  const enableExtensionCheckbox = document.getElementById(
    "enableExtension"
  ) as HTMLInputElement;
  const autoSaveCheckbox = document.getElementById(
    "autoSave"
  ) as HTMLInputElement;
  const themeSelect = document.getElementById("theme") as HTMLSelectElement;
  const saveBtn = document.getElementById("saveBtn");

  // 저장된 설정 불러오기
  chrome.storage.sync.get("settings", function (data) {
    if (data.settings) {
      enableExtensionCheckbox.checked = data.settings.enabled;
      autoSaveCheckbox.checked = data.settings.autoSave;
      themeSelect.value = data.settings.theme;
    }
  });

  // 설정 저장 버튼 클릭 이벤트
  if (saveBtn) {
    saveBtn.addEventListener("click", function () {
      const settings = {
        enabled: enableExtensionCheckbox.checked,
        autoSave: autoSaveCheckbox.checked,
        theme: themeSelect.value,
      };

      chrome.storage.sync.set({ settings: settings }, function () {
        // 저장 완료 메시지 표시
        const status = document.createElement("div");
        status.textContent = "설정이 저장되었습니다.";
        status.style.color = "green";
        status.style.marginTop = "10px";

        const settingsContainer = document.querySelector(".settings-container");
        if (settingsContainer) {
          settingsContainer.appendChild(status);

          // 2초 후 메시지 제거
          setTimeout(function () {
            settingsContainer.removeChild(status);
          }, 2000);
        }
      });
    });
  }
});
