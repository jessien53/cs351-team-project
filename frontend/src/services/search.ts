import type { SearchParams, SearchResponse } from "../types/search";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

function buildQuery(params: SearchParams) {
  const qp: Record<string, string> = {};
  if (params.query) qp.q = params.query;
  if (params.tags && params.tags.length) qp.tags = params.tags.join(",");
  if (params.sort) qp.sort = params.sort;
  if (params.page) qp.page = String(params.page);
  if (params.per_page) qp.per_page = String(params.per_page);
  return new URLSearchParams(qp).toString();
}

// export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
//   const qs = buildQuery(params);
//   const url = `${API_BASE}/api/search${qs ? `?${qs}` : ""}`;

//   const res = await fetch(url, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) {
//     const text = await res.text().catch(() => "");
//     throw new Error(`Search API error: ${res.status} ${res.statusText} ${text}`);
//   }

//   const contentType = res.headers.get("content-type") || "";
//   if (!contentType.includes("application/json")) {
//     const text = await res.text().catch(() => "");
//     throw new Error(
//       `Invalid response from Search API. Expected JSON but received content-type: ${contentType}. Body snippet: ${text.slice(0, 300)}`
//     );
//   }

//   const json = await res.json();
//   return json as SearchResponse;
// }

export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
  const qs = buildQuery(params);
  const url = `${API_BASE}/api/search${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, { headers: { "Accept": "application/json" } });

  if (!res.ok) {
    throw new Error(`Search failed: ${res.statusText}`);
  }

  const data = await res.json();

  // Ensure consistent structure
  return {
    results: Array.isArray(data.results) ? data.results : [],
    total: Number(data.total || 0),
    page: Number(data.page || 1),
    per_page: Number(data.per_page || 12),
  };
}