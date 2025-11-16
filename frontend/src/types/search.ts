export interface Product {
  id?: string;
  title: string;
  price: string; // string with currency ("$40")
  user: string;
  user_id: string;
  time: string; // human readable time ("2hrs ago")
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
