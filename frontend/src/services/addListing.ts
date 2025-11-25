import type { ListingFormData, ListingResponse } from "../types/create.ts";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function addListing(data: ListingFormData): Promise<ListingResponse> {
  // Prepare numeric/boolean fields to match backend expectations
  const payload = {
    ...data,
    price: parseFloat(data.price),
    quantity_available: parseInt(data.quantity),
    is_digital: data.isDigital,
    customizable: data.customizable,
    delivery_available: data.deliveryAvailable,
    shipping_available: data.shippingAvailable,
    delivery_fee: data.deliveryFee ? parseFloat(data.deliveryFee) : null,
    subcategory_id: data.subcategory || null,
  };

  const res = await fetch(`${API_BASE}/api/listings/create/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to add listing");
  }

  const responseData = await res.json();

    // Ensure consistent structure
    return {
    item_id: responseData.item_id,
    title: responseData.title,
    description: responseData.description,
    category_id: responseData.category_id,
    price: responseData.price,
    quantity_available: responseData.quantity_available,
    status: responseData.status,
    thumbnail_url: responseData.thumbnail_url,
    seller: responseData.seller_id
        ?{
            id: responseData.seller_id,
            name: responseData.seller_name,
            avatar_url: responseData.seller_avatar_url,
        }: null,
    };
}
