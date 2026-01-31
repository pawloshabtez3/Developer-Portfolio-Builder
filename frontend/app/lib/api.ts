const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const message = payload?.error?.message || "Request failed";
    throw new Error(message);
  }

  return payload?.data as T;
}
