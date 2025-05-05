import React from "react";
import { SearchFormProps } from "../types/types";

const SearchForm: React.FC<SearchFormProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
}) => (
  <form onSubmit={handleSearch} className="mb-6">
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search anything..."
        className="w-full p-3 pl-4 pr-12 border rounded-lg shadow-sm focus:ring-2 focus:ring-primary/40 focus:border-primary transition duration-200 bg-white"
        autoFocus
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-md hover:bg-primary/90 transition duration-200"
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
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
      </button>
    </div>
  </form>
);

export default SearchForm;
