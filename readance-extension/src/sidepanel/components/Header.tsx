import React from "react";

const Header: React.FC = () => (
  <header className="bg-white shadow-sm py-4 px-5 sticky top-0 z-10">
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-primary">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
          Readance
        </span>
      </h1>
    </div>
  </header>
);

export default Header;
