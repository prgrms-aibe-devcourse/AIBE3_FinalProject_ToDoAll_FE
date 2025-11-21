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
  const raw = await request<any>('/v1/users/me', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return raw?.data ?? raw;
}

//  내 정보 조회 API
export async function getMe(): Promise<unknown> {
  const data = await request<any>('/v1/users/me', {
    method: 'GET',
  });

  return data?.data ?? data;
}
// 비밀번호 변경 API
export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  await request<void>('/v1/users/me/password', {
    method: 'PATCH',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
