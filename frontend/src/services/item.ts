const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export interface CreateItemRequest {
  seller_id: string;
  title: string;
  description: string;
  price: number;
  quantity_available: number;
  category_id: string | null;
  thumbnail_url?: string;
  condition?: string;
  tags?: string[];
  status?: "draft" | "active";
  [key: string]: unknown;
}

export interface CreateItemResponse {
  success: boolean;
  item_id?: string;
  message?: string;
  [key: string]: unknown;
}

export async function createItem(
  itemData: CreateItemRequest,
  images?: File[]
): Promise<CreateItemResponse> {
  // Create FormData to send multipart/form-data with images
  const formData = new FormData();
  
  // Append all text fields
  Object.keys(itemData).forEach((key) => {
    const value = itemData[key];
    if (value !== null && value !== undefined) {
      if (key === 'tags' && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });
  
  // Append image files
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }
  
  const res = await fetch(`${API_BASE}/api/listings/create/`, {
    method: "POST",
    // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create listing");
  }

  return res.json();
}

export async function createListing(
  listingData: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_BASE}/api/listings/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(listingData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to create listing");
  }

  return res.json();
}

export interface UserItem {
  id: string;
  title: string;
  price: number;
  image: string;
  user_id: string;
  seller_name: string;
  status: string;
  created_at: string;
}

export async function getUserItems(userId: string): Promise<UserItem[]> {
  const res = await fetch(`${API_BASE}/api/users/${userId}/items/`);

  if (!res.ok) {
    throw new Error("Failed to fetch user items");
  }

  const data = await res.json();
  return data.items;
}