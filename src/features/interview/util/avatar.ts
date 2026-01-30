// src/util/avatar.ts
import { userDefaultImage } from '@/const.ts';

export const DEFAULT_AVATAR: string = userDefaultImage;

export function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:');
}

export function normalizeAvatarUrl(input?: string | null) {
  if (!input) return undefined;
  const url = String(input).trim();
  if (!url) return undefined;

  if (isAbsoluteUrl(url)) return url;

  const base = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  if (!base) return url;

  const path = url.startsWith('/') ? url : `/${url}`;
  return `${base}${path}`;
}

export function toNumId(v: unknown, fallback = -1) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}
