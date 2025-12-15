// export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
// export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;



export async function apiPost(path: string, data: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.detail || json.message || "API Error");
  return json;
}
