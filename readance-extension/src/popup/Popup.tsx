import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";

const Popup: React.FC = () => {
  // 현재 페이지 북마크 버튼 클릭 핸들러
  const handleBookmarkClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0].id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "addCurrentPageBookmark" },
          (response) => {
            console.log("북마크 추가 응답:", response);
            if (response && response.status === "success") {
              alert("페이지가 북마크에 추가되었습니다!");
            }
          }
        );
      }
    });
  };

  // 옵션 페이지 열기 버튼 클릭 핸들러
  const handleOptionsClick = () => {
    chrome.runtime.openOptionsPage();
  };

  // 사이드 패널 열기 핸들러
  const handleOpenSidePanelClick = () => {
    chrome.runtime.sendMessage({ action: "openSidePanel" }, (response) => {
      console.log("사이드 패널 열기 응답:", response);
    });
  };

  return (
    <div className="w-80 p-4 font-sans">
      <h1 className="text-xl font-bold text-primary mb-4">Readance</h1>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-gray-700">
          Select text on any web page to save it to your Readance collection.
        </p>
        <button className="w-full" onClick={handleBookmarkClick}>
          Bookmark Current Page
        </button>
        <button
          className="w-full bg-secondary text-gray-700 hover:bg-secondary-dark"
          onClick={handleOpenSidePanelClick}
        >
          Open Side Panel
        </button>
        <button
          className="w-full bg-secondary text-gray-700 hover:bg-secondary-dark"
          onClick={handleOptionsClick}
        >
          Options
        </button>
      </div>
    </div>
  );
};

// 페이지에 Popup 컴포넌트 렌더링
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);

export default Popup;
