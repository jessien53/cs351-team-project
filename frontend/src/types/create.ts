export interface ImageObject {
  id: number;
  url: string;
  file: File;
  dataURL: string;
}
export interface SellerInfo {
  id: string;
  name: string;
  avatar_url?: string | null;
}
export interface SellerInfo {
  id: string;
  name: string;
  avatar_url?: string | null;
}

export type ListingStatus = "draft" | "active";

export interface ListingFormData {
  title: string;
  price: string;
  description: string;
  category: string;
  subcategory: string;
  condition: string;
  quantity: string;
  isDigital: boolean;
  tags: string[];
  processingTime: string;
  customizable: boolean;
  deliveryAvailable: boolean;
  deliveryRadius: string;
  deliveryFee: string;
  shippingAvailable: boolean;
  status: ListingStatus;
  images?: ImageObject[];
  video_url?: string;
}

export interface ListingResponse {
  item_id: string;
  title: string;
  description: string;
  category_id: string;
  price: number;
  quantity_available: number;
  status: "draft" | "active" | "paused" | "sold_out" | "archived";
  thumbnail_url: string;
  seller: SellerInfo | null;
}

export interface ListingResponse {
  item_id: string;
  title: string;
  description: string;
  category_id: string;
  price: number;
  quantity_available: number;
  status: "draft" | "active" | "paused" | "sold_out" | "archived";
  thumbnail_url: string;
  seller: SellerInfo | null;
}