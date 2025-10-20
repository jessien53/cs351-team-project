import type { SearchParams, SearchResponse } from "../types/search";

const API_BASE = import.meta.env.VITE_API_BASE || ""; // e.g. http://localhost:8000
const USE_MOCK = Boolean(Number(import.meta.env.VITE_USE_MOCK || "0"));

function buildQuery(params: SearchParams) {
  const qp: Record<string, string> = {};
  if (params.query) qp.q = params.query;
  if (params.tags && params.tags.length) qp.tags = params.tags.join(",");
  if (params.sort) qp.sort = params.sort;
  if (params.page) qp.page = String(params.page);
  if (params.per_page) qp.per_page = String(params.per_page);
  return new URLSearchParams(qp).toString();
}

// Simple deterministic mock data generator that respects query/tags/sort
function mockSearch(params: SearchParams): SearchResponse {
  const all = Array.from({ length: 24 }).map((_, i) => ({
    id: i + 1,
    title: i % 2 === 0 ? `Intro to AI Vol.${(i % 5) + 1}` : `Textbook ${i + 1}`,
    price: `$${20 + (i % 10) * 5}`,
    user: `Seller ${i % 7}`,
    time: `${i + 1}hrs ago`,
    image: `https://placehold.co/600x400?text=Item+${i + 1}`,
  }));

  let results = all.slice();
  if (params.query) {
    const q = params.query.toLowerCase();
    results = results.filter((r) => r.title.toLowerCase().includes(q));
  }
  if (params.tags && params.tags.length) {
    // naive: filter by tag string presence in title
    results = results.filter((r) => params.tags!.some((t) => r.title.includes(t) || r.user.includes(t)));
  }
  if (params.sort === "price_asc") {
    results.sort((a, b) => Number(a.price.replace(/[^0-9.-]+/g, "")) - Number(b.price.replace(/[^0-9.-]+/g, "")));
  } else if (params.sort === "price_desc") {
    results.sort((a, b) => Number(b.price.replace(/[^0-9.-]+/g, "")) - Number(a.price.replace(/[^0-9.-]+/g, "")));
  } else if (params.sort === "newest") {
    results = results.reverse();
  }

  const page = params.page ?? 1;
  const per_page = params.per_page ?? 12;
  const start = (page - 1) * per_page;
  const paged = results.slice(start, start + per_page);

  return { results: paged, total: results.length, page, per_page };
}

export async function searchProducts(params: SearchParams): Promise<SearchResponse> {
  // If mock mode explicitly enabled or no API_BASE configured, return mock data
  if (USE_MOCK || !API_BASE) {
    // simulate network latency
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 300));
    return mockSearch(params);
  }

  const qs = buildQuery(params);
  const url = `${API_BASE}/api/search${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Search API error: ${res.status} ${res.statusText} ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text().catch(() => "");
    // Common cause: Vite dev server returned index.html (HTML) because API_BASE not set or proxy misconfigured
    throw new Error(
      `Invalid response from Search API. Expected JSON but received content-type: ${contentType}. Body snippet: ${text.slice(0, 300)}`
    );
  }

  const json = await res.json();
  // Expecting { results: [...], total, page, per_page }
  return json as SearchResponse;
}
