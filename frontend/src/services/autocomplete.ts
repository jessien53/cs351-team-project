// frontend/src/services/autocomplete.ts

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export interface AutocompleteResponse {
  suggestions: string[];
}

export async function getAutocompleteSuggestions(query: string): Promise<string[]> {
  if (!query.trim()) {
    return [];
  }

  const url = `${API_BASE}/api/autocomplete/?q=${encodeURIComponent(query.trim())}`;

  try {
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      console.error(`Autocomplete failed: ${res.statusText}`);
      return [];
    }

    const data: AutocompleteResponse = await res.json();
    return Array.isArray(data.suggestions) ? data.suggestions : [];
  } catch (error) {
    console.error("Autocomplete error:", error);
    return [];
  }
}