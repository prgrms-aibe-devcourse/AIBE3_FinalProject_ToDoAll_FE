import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

export type UserProfile = {
  id: number;
  name?: string;
  nickname?: string;
  profileUrl?: string;
};

export type ResumeProfile = {
  id: number;
  resumeFileUrl?: string;
};

export async function getUserProfileAuthed(
  client: ClientRequestType,
  userId: number
): Promise<UserProfile> {
  const raw = await client.request<UserProfile>(`/api/v1/users/${userId}`, {
    method: 'GET',
  });

  return raw!;
}

export async function getResumeAuthed(
  client: ClientRequestType,
  resumeId: number
): Promise<ResumeProfile> {
  const raw = await client.request<ResumeProfile>(`/api/v1/resumes/${resumeId}`, {
    method: 'GET',
  });

  return raw!;
}

/** ✅ 게스트(Interview-Token)로 resume 조회 */
/* TODO : 미사용 로직 삭제
export async function getResumeWithGuestToken(
  resumeId: number,
  guestToken: string
): Promise<ResumeProfile> {
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const url = `${BASE_URL}/api/v1/resumes/${resumeId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Interview-Token': guestToken },
    credentials: 'include',
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    throw new Error(body?.message ?? `요청 실패 (status=${res.status})`);
  }

  return (body?.data ?? body) as ResumeProfile;
}
*/
