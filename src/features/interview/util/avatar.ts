// src/util/avatar.ts
import defaultAvatarUrl from '@/assets/default-profile 복사본.jpg';

export const DEFAULT_AVATAR: string = defaultAvatarUrl;

export function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:');
}

export function normalizeAvatarUrl(input?: string | null) {
  if (!input) return undefined;
  const url = String(input).trim();
  if (!url) return undefined;

  // 이미 절대 URL이면 그대로
  if (isAbsoluteUrl(url)) return url;

  // BASE_URL (예: http://localhost:8080)
  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  if (!base) return url;

  // 앞에 / 없으면 붙임
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

/** senderId/ids 정규화 */
export function toNumId(v: unknown, fallback = -1) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
