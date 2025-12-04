/* global RequestInit, HeadersInit */

const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function authedRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const token = localStorage.getItem('accessToken');

  const headers: HeadersInit = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}), // body 있을 때만
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  let body: unknown = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message = (body as any)?.message ?? `요청 실패 (status=${res.status})`;
    throw new Error(message);
  }

  return body as T;
}

export function unwrap<T>(raw: any): T {
  return raw?.data ?? raw;
}
