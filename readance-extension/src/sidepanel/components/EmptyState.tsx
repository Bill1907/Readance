import React from "react";

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center py-12 px-4">
    <div className="bg-blue-50 rounded-full p-6 mb-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-10 w-10 text-primary"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
    <h2 className="text-xl font-semibold mb-2 text-slate-700">
      Ready to explore
    </h2>
    <p className="text-slate-500 mb-6 max-w-xs">
      Select text on any web page and search with Readance for enhanced results.
    </p>
  </div>
);

export default EmptyState;
