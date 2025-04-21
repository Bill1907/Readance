export interface TavilySearchResult {
  title: string;
  url: string;
  content: string;
  score: number;
  images?: string[];
}

export interface SearchResponse {
  success: boolean;
  results?: TavilySearchResult[];
  error?: string;
  query: string;
}
