import { request } from '../../../lib/utils/base';

// 내 정보 수정 API
export async function updateMe(payload: {
  name?: string;
  nickname?: string;
  phoneNumber?: string;
  position?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  profileUrl?: string;
}): Promise<any> {
  const raw = await request<any>('/api/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return raw?.data ?? raw;
}

//  내 정보 조회 API
export async function getMe(): Promise<unknown> {
  const data = await request<any>('/api/v1/users/me', {
    method: 'GET',
  });

  return data?.data ?? data;
}
// 비밀번호 변경 API
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await request<void>('/api/v1/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

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
