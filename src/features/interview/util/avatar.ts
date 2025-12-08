export const DEFAULT_AVATAR = '/images/default-profile.jpg';

export function normalizeAvatarUrl(url?: string | null) {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return DEFAULT_AVATAR;

  // 절대경로면 그대로
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;

  // "/images/..." 같은 상대경로는 그대로 사용
  return trimmed;
}
