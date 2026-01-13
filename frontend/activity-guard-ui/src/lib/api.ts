import { clearToken, getToken } from "../auth/token";

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

type ApiError = {
  status: number;
  title?: string;
  detail?: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
  }

  if (!res.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any = null;
    try {
      body = await res.json();
    } catch {
      // ignore
    }

    const err: ApiError = {
      status: res.status,
      title: body?.title,
      detail: body?.detail ?? body?.message,
    };

    throw err;
  }

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
