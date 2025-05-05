import React from "react";

const NoResultsFound: React.FC = () => (
  <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 mx-auto text-slate-400 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="text-slate-500">No results found. Try different keywords.</p>
  </div>
);

export default NoResultsFound;
