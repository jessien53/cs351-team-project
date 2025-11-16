export interface ProfileService {
  name: string;
  description: string;
  price_per_hour?: number;
}

export interface Profile {
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  major: string | null;
  is_verified: boolean;
  bio: string | null;
  items_sold: number;
  avg_response_time: string | null;
  followers_count: number;
  rating_average: number;
  rating_count: number;
  services: ProfileService[];
  created_at: string; // ISO date string
}