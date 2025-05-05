import React from "react";

const LoadingIndicator: React.FC = () => (
  <div className="flex justify-center items-center my-8">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-primary animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-white"></div>
      </div>
    </div>
  </div>
);

export default LoadingIndicator;
