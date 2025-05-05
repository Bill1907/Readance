import React from "react";

const ErrorMessage: React.FC = () => (
  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg my-6 flex items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>Search failed. Please check your connection and try again.</span>
  </div>
);

export default ErrorMessage;
