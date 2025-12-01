const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

// services/disjointSet.ts

export interface PopulateResponse {
  status: string;
  message: string;
}

/**
 * Call backend API to populate the Disjoint Set table
 */
export async function populateDisjointSet(): Promise<PopulateResponse> {
  const url = `${API_BASE}/api/populate-disjoint-set/`;

  
    const res = await fetch(url, {
      method: "POST", // backend expects POST
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to populate: ${res.statusText}`);
    }
    const data: PopulateResponse = await res.json();
    return data;
}
