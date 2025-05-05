import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "../index.css";

// 타입 import
import { SearchResult } from "./types/types";

// 컴포넌트 import
import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import LoadingIndicator from "./components/LoadingIndicator";
import SearchResults from "./components/SearchResults";
import ErrorMessage from "./components/ErrorMessage";
import EmptyState from "./components/EmptyState";
import Footer from "./components/Footer";

// 메인 SidePanel 컴포넌트
const SidePanel: React.FC = () => {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [currentQuery, setCurrentQuery] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    console.log(
      "SidePanel: Component mounted, loading initial data from storage"
    );

    // Load selected text from storage when component mounts
    chrome.storage.local.get(
      [
        "searchResults",
        "searchStatus",
        "currentSearchQuery",
        "lastSearchQuery",
        "selectedText",
      ],
      (result) => {
        console.log("SidePanel: Initial storage data loaded:", result);

        // Prioritize selected text over previous search queries
        if (result.selectedText) {
          setSearchQuery(result.selectedText);
          // Clear the selected text after using it to avoid using it again on next panel open
          chrome.storage.local.remove("selectedText");

          // If there's selected text but no search in progress, automatically start search
          if (!result.searchStatus || result.searchStatus !== "searching") {
            handleSearchWithQuery(result.selectedText);
          }
        } else if (result.currentSearchQuery) {
          setCurrentQuery(result.currentSearchQuery);
          setSearchQuery(result.currentSearchQuery);
        } else if (result.lastSearchQuery) {
          setSearchQuery(result.lastSearchQuery);
        }

        if (result.searchResults) {
          console.log(
            "SidePanel: Setting initial searchResults:",
            result.searchResults
          );
          setSearchResults(result.searchResults);
        }
        if (result.searchStatus) {
          console.log(
            "SidePanel: Setting initial searchStatus:",
            result.searchStatus
          );
          setSearchStatus(result.searchStatus);
        }
      }
    );

    // Listen for storage changes
    const handleStorageChange = (changes: any, area: string) => {
      if (area === "local") {
        console.log("SidePanel: Storage changed:", changes);

        // 순서 변경: 먼저 검색어 정보를 처리
        if (changes.currentSearchQuery) {
          const newQuery = changes.currentSearchQuery.newValue || "";
          console.log("SidePanel: Updating currentQuery state with:", newQuery);
          setCurrentQuery(newQuery);
          setSearchQuery(newQuery);
        }

        if (changes.selectedText && changes.selectedText.newValue) {
          const newSelectedText = changes.selectedText.newValue;
          console.log("SidePanel: New selectedText detected:", newSelectedText);
          setSearchQuery(newSelectedText);
          // Automatically search with the selected text
          handleSearchWithQuery(newSelectedText);
        }

        // 그 다음 검색 결과와 상태 처리
        if (changes.searchStatus) {
          const newStatus = changes.searchStatus.newValue || "";
          console.log(
            "SidePanel: Updating searchStatus state with:",
            newStatus
          );
          setSearchStatus(newStatus);
        }

        if (changes.searchResults) {
          const newResults = changes.searchResults.newValue || [];
          console.log(
            "SidePanel: Updating searchResults state with:",
            newResults
          );

          // Type check to ensure we're getting an array
          if (Array.isArray(newResults)) {
            setSearchResults(newResults);
          } else {
            console.error(
              "SidePanel: searchResults is not an array:",
              newResults
            );
            // Try to handle object response if results is inside
            if (
              newResults &&
              typeof newResults === "object" &&
              "results" in newResults
            ) {
              console.log(
                "SidePanel: Found results array inside object, using it instead"
              );
              setSearchResults(newResults.results || []);
            } else {
              // Fallback to empty array
              setSearchResults([]);
            }
          }
        }
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  // 검색 수행 함수 (폼 제출)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearchWithQuery(searchQuery.trim());
    }
  };

  // 검색 수행 함수 (직접 쿼리로 검색)
  const handleSearchWithQuery = (query: string) => {
    console.log("SidePanel: Sending search request for query:", query);
    chrome.runtime.sendMessage(
      {
        action: "performSearch",
        query: query,
      },
      (response) => {
        console.log("SidePanel: Search request response:", response);
      }
    );
  };

  // 렌더링 직전 상태 로깅
  console.log("SidePanel: Rendering with state:", {
    currentQuery,
    searchQuery,
    searchStatus,
    searchResultsLength: searchResults?.length || 0,
  });

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800">
      {/* Header */}
      <Header />

      {/* Search section */}
      <div className="flex-1 overflow-auto p-5">
        {/* 검색 입력 폼 */}
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />

        {/* 검색 상태 표시 */}
        {searchStatus === "searching" && <LoadingIndicator />}

        {/* 검색 결과 헤더 및 목록 */}
        {searchStatus === "completed" && (
          <SearchResults
            currentQuery={currentQuery || searchQuery || "Recent search"}
            searchResults={searchResults}
          />
        )}

        {/* 에러 표시 */}
        {searchStatus === "error" && <ErrorMessage />}

        {/* 검색 전 안내 */}
        {!searchStatus && !currentQuery && <EmptyState />}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Render SidePanel component to the page
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <SidePanel />
  </React.StrictMode>
);

export default SidePanel;
