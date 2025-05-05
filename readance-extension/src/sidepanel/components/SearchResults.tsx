import React from "react";
import { SearchResultsProps } from "../types/types";
import NoResultsFound from "./NoResultsFound";
import ResultItem from "./ResultItem";

const SearchResults: React.FC<SearchResultsProps> = ({
  currentQuery,
  searchResults,
}) => (
  <div className="mb-6">
    <h2 className="text-md text-slate-600 mb-4 font-medium">
      Results for:{" "}
      <span className="font-semibold text-primary">{currentQuery}</span>
    </h2>

    {searchResults.length === 0 ? (
      <NoResultsFound />
    ) : (
      <div className="space-y-4">
        {searchResults.map((result, index) => (
          <ResultItem key={index} result={result} />
        ))}
      </div>
    )}
  </div>
);

export default SearchResults;
