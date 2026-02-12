const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_TOKEN_KEY = "auth_token";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const getAuthToken = () => {
  if (!canUseStorage()) return null;
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setAuthToken = (token: string) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

export type ApiError = {
  message: string;
  details?: unknown;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
    }
    const message = payload?.error?.message || "Request failed";
    throw new Error(message);
  }

  return payload?.data as T;
}

/**
 * Generate and download resume PDF
 * Returns a Blob that can be used to trigger a download
 */
export async function generateResume(): Promise<Blob> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const headers = new Headers();
  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_URL}/api/resume/generate`, {
    method: "POST",
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthToken();
    }
    // Try to parse error message
    const errorPayload = await res.json().catch(() => null);
    const message = errorPayload?.error?.message || "Failed to generate resume";
    throw new Error(message);
  }

  return await res.blob();
}
