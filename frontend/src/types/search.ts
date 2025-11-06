export interface Product {
  id?: number;
  title: string;
  price: string; // string with currency (e.g. "$40")
  user: string;
  user_id: string;
  time: string; // human readable time (e.g. "2hrs ago")
  image?: string;
}

export type SortOption = 'relevance' | 'newest' | 'price_asc' | 'price_desc';

export interface SearchParams {
  query?: string;
  tags?: string[];
  sort?: SortOption;
  page?: number;
  per_page?: number;
}

export interface SearchResponse {
  results: Product[];
  total: number;
  page: number;
  per_page: number;
}
