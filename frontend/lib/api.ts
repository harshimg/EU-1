// export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
//export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
//export const API_URL = "https://apialpharesult.vercel.app" || process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";
// export const API_URL = "https://apialpharesult.vercel.app";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
// export const API_URL = "http://127.0.0.1:8000";


// export async function apiPost(path: string, data: any) {
//   const res = await fetch(`${API_URL}${path}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   const json = await res.json();
//   if (!res.ok) throw new Error(json.detail || json.message || "API Error");
//   return json;
// }


// async function apiFetch(path: string, options: RequestInit = {}) {
//   const token = localStorage.getItem("token");

//   const res = await fetch(`${API_URL}${path}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options.headers || {}),
//     },
//   });

//   // 🚨 GLOBAL 401 HANDLER
//   if (res.status === 401) {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     // simplest & safest
//     window.location.reload();

//     throw new Error("Session expired. Please login again.");
//   }

//   const json = await res.json();

//   if (!res.ok) {
//     throw new Error(json.detail || json.message || "API Error");
//   }

//   return json;
// }



// // api for update
// export async function apiPut(path: string, data: any) {
//   const res = await fetch(`${API_URL}${path}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//     body: JSON.stringify(data),
//   });

//   const json = await res.json();
//   if (!res.ok) throw new Error(json.detail || json.message || "API Error");
//   return json;
// }

// /* ---------------- HELPERS ---------------- */

// export async function apiPost(path: string, data: any) {
//   return apiFetch(path, {
//     method: "POST",
//     body: JSON.stringify(data),
//   });
// }

// export async function apiGet(path: string) {
//   return apiFetch(path, {
//     method: "GET",
//   });
// }


async function apiFetch(path: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // 🌍 GLOBAL 401 HANDLER
  if (res.status === 401) {

    if (path.startsWith("/api/public")) {
      const json = await res.json();
      throw new Error(json.detail || "Unauthorized");
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
    throw new Error("Session expired. Please login again.");
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.detail || json.message || "API Error");
  }

  return json;
}

/* ---------------- HELPERS ---------------- */

export async function apiGet(path: string) {
  return apiFetch(path, { method: "GET" });
}

export async function apiPost(path: string, data: any) {
  return apiFetch(path, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiPut(path: string, data: any) {
  return apiFetch(path, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiPatch(path: string, data: any) {
  return apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(data)
  });
}



