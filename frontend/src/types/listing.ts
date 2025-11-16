export interface Item {
  item_id: string;
  title: string;
  description: string;
  category_id: string;
  category_name: string;
  price: number;
  quantity_available: number;
  is_digital: boolean;
  condition: "new" | "like_new" | "good" | "fair" | "poor" | null;
  tags: string[];
  processing_time: string | null;
  customizable: boolean;
  thumbnail_url: string;
  video_url: string | null;
  delivery_available: boolean;
  delivery_fee: number | null;
  shipping_available: boolean;
  total_sales: number;
  views_count: number;
  favorites_count: number;
  rating_average: number;
  rating_count: number;
  status: string;
  created_at: string; // ISO date string

  // Joined seller data
  seller_id: string;
  seller_name: string | null;
  seller_major: string | null;
  seller_rating: number;
  seller_sales: number;
  seller_avatar_url: string | null;
  seller_is_verified: boolean;
}