/* global RequestInit, HeadersInit */

export const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...(options.headers ?? {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = (body as any)?.message ?? `요청 실패 (status=${response.status})`;
    throw new Error(message);
  }

  return body as T;
}

export function unwrap<T>(raw: any): T {
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return raw.data as T;
  }
  return raw as T;
}
