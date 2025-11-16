import type { Item } from "../types/listing";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function getListingById(id: string): Promise<Item> {
  const url = `${API_BASE}/api/item/${id}/`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Listing not found for ID: ${id}`);
    }
    throw new Error(`Listing fetch failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data as Item;
}