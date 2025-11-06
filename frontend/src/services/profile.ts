// frontend/src/services/profile.ts
import type { Profile } from "../types/profile";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function getProfileById(id: string): Promise<Profile> {
  const url = `${API_BASE}/api/profile/${id}/`;

  const res = await fetch(url, {
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`Profile not found for ID: ${id}`);
    }
    throw new Error(`Profile fetch failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data as Profile;
}