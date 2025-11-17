export interface ImageObject {
  id: number;
  url: string;
  file: File;
  dataURL: string;
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