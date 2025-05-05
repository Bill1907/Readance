import React from "react";
import { ResultItemProps } from "../types/types";

const ResultItem: React.FC<ResultItemProps> = ({ result }) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 hover:shadow-md transition duration-200">
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:text-primary/80 font-medium text-lg block mb-2"
    >
      {result.title}
    </a>
    <p className="text-slate-700 mb-3">{result.content}</p>
    <div className="flex items-center justify-between text-xs text-slate-500">
      <div className="flex items-center flex-1 min-w-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-3.5 mr-1 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
          />
        </svg>
        <span className="truncate mr-2">{result.url}</span>
      </div>
      <span className="text-slate-400 flex-shrink-0">
        (Score: {result.score.toFixed(2)})
      </span>
    </div>
  </div>
);

export default ResultItem;
