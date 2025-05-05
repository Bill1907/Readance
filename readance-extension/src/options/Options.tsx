import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "../index.css";

interface Settings {
  enabled: boolean;
  autoSave: boolean;
  theme: string;
}

const Options: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    enabled: true,
    autoSave: true,
    theme: "light",
  });
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // 저장된 설정 불러오기
  useEffect(() => {
    chrome.storage.sync.get("settings", (data) => {
      if (data.settings) {
        setSettings(data.settings);
      }
    });
  }, []);

  // 설정 변경 핸들러
  const handleEnabledChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, enabled: e.target.checked });
  };

  const handleAutoSaveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, autoSave: e.target.checked });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, theme: e.target.value });
  };

  // 설정 저장 버튼 클릭 핸들러
  const handleSaveClick = () => {
    chrome.storage.sync.set({ settings }, () => {
      setSaveMessage("설정이 저장되었습니다.");

      // 2초 후 메시지 숨기기
      setTimeout(() => {
        setSaveMessage(null);
      }, 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-5 font-sans">
      <h1 className="text-2xl font-bold text-primary mb-5">Readance Options</h1>

      <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
        <div className="mb-4">
          <label className="flex items-start mb-1">
            <input
              type="checkbox"
              className="mr-2 mt-1"
              checked={settings.enabled}
              onChange={handleEnabledChange}
            />
            <div>
              <div className="font-medium">Enable Extension</div>
              <p className="text-sm text-gray-600">
                Turn the extension on or off
              </p>
            </div>
          </label>
        </div>

        <div className="mb-4">
          <label className="flex items-start mb-1">
            <input
              type="checkbox"
              className="mr-2 mt-1"
              checked={settings.autoSave}
              onChange={handleAutoSaveChange}
            />
            <div>
              <div className="font-medium">Auto-save Selections</div>
              <p className="text-sm text-gray-600">
                Automatically save text selections
              </p>
            </div>
          </label>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1" htmlFor="theme">
            Theme:
          </label>
          <select
            id="theme"
            className="w-full p-2 border border-gray-300 rounded"
            value={settings.theme}
            onChange={handleThemeChange}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <button className="mt-4 w-full" onClick={handleSaveClick}>
          Save Settings
        </button>

        {saveMessage && (
          <div className="mt-4 p-2 bg-green-100 text-green-700 rounded text-center">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
};

// 페이지에 Options 컴포넌트 렌더링
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
);

export default Options;
