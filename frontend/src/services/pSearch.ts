
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
export type TopProduct = {
  item_id: string;
  title: string;
  thumbnail_url: string;
  total_sales: number;
  rating_average: number;
  priority: number;
};

export type TopProductsResponse = {
  top_items: TopProduct[];
};


export async function fetchTopProducts(): Promise<TopProductsResponse> {
  const url = `${API_BASE}/api/top-products/`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch top products: ${res.statusText}`);
  }

  const data = await res.json();

  // Ensure consistent structure
  return {
    top_items: Array.isArray(data.top_items) ? data.top_items : [],
  };
}
