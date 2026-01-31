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

/**
 * Generate and download resume PDF
 * Returns a Blob that can be used to trigger a download
 */
export async function generateResume(): Promise<Blob> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const res = await fetch(`${API_URL}/api/resume/generate`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    // Try to parse error message
    const errorPayload = await res.json().catch(() => null);
    const message = errorPayload?.error?.message || "Failed to generate resume";
    throw new Error(message);
  }

  return await res.blob();
}
