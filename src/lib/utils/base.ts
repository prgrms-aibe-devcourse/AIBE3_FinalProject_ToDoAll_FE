/* global RequestInit, HeadersInit */
// 백엔드 기본 주소
export const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

// API 서버의 ORIGIN (정적 리소스, 이미지 등에 사용)
export const API_ORIGIN = BASE_URL.replace(/\/api$/, '');

export async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  // 경로 설정
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;

  // 3) 기본 헤더 + 토큰
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // 4) fetch 호출
  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  // 5) 응답 파싱
  let body: unknown;
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
