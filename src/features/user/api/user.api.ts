import { userDefaultImage } from '@/const.ts';
import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

// 내 정보 수정 API
export async function updateMe(
  client: ClientRequestType,
  payload: {
    name?: string;
    nickname?: string;
    phoneNumber?: string;
    position?: string;
    birthDate?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    profileUrl?: string;
  }
): Promise<any> {
  const raw = await client.request<any>('/api/v1/users/me', {
    method: 'PATCH',
    body: payload,
  });
  return raw?.data ?? raw;
}

//  내 정보 조회 API
export async function getMe(client: ClientRequestType): Promise<unknown> {
  const data = await client.request<any>('/api/v1/users/me', {
    method: 'GET',
  });

  return data?.data ?? data;
}
// 비밀번호 변경 API
export async function changePassword(
  client: ClientRequestType,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await client.request<void>('/api/v1/users/me/password', {
    method: 'PATCH',
    body: { currentPassword, newPassword },
  });
}

// 프로필 이미지 변경 API (S3 업로드)

export async function uploadProfileImage(client: ClientRequestType, file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await client.request<any>('/api/v1/users/me/profile-image', {
    method: 'PATCH',
    body: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    const message = body?.message ?? `프로필 이미지 변경 실패 (status=${res.status})`;
    throw new Error(message);
  }

  const profileUrl =
    body?.data?.profileUrl && body.data.profileUrl.trim() !== ''
      ? body.data.profileUrl
      : userDefaultImage;

  return {
    ...body.data,
    profileUrl,
  };
}

// 프로필 이미지 삭제 API (기본 이미지로 되돌리기)
export async function removeProfileImage(client: ClientRequestType): Promise<unknown> {
  const res = await client.request<any>('/api/v1/users/me/profile-image', {
    method: 'DELETE',
  });

  const data = res?.data ?? res;

  const profileUrl =
    data?.profileUrl && data.profileUrl.trim() !== '' ? data.profileUrl : userDefaultImage;

  return {
    ...data,
    profileUrl,
  };
}

/* TODO : 미사용 로직 삭제
// 채팅 내역 조회 API
// GET /api/v1/interviews/{interviewId}/chat
// Response: { errorCode: 0, message: "string", data: [{ id, senderId, sender, content, createdAt }] }
export interface ChatMessage {
  id: number;
  senderId: number;
  sender: string;
  content: string;
  createdAt: string;
}

export async function getChatHistory(interviewId: number): Promise<ChatMessage[]> {
  const res = await request<{ errorCode: number; message: string; data: ChatMessage[] }>(
    `/api/v1/interviews/${interviewId}/chat`,
    {
      method: 'GET',
    }
  );

  return res?.data ?? [];
}

// 면접 메모 조회 API
export async function getInterviewMemos(interviewId: number): Promise<any[]> {
  const res = await request<any>(`/api/v1/interviews/${interviewId}/memos`, {
    method: 'GET',
  });

  return res?.data ?? res;
}
*/
