// Types for search functionality
export interface SearchResult {
  title: string;
  url: string;
  content: string;
  rawContent: string | null;
  score: number;
}

// Props interfaces for components
export interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export interface SearchResultsProps {
  currentQuery: string;
  searchResults: SearchResult[];
}

export interface ResultItemProps {
  result: SearchResult;
}
