import { BASE_URL, request } from '../../../lib/utils/base';

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

// 프로필 이미지 변경 API (S3 업로드)

export async function uploadProfileImage(file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/api/v1/users/me/profile-image`, {
    method: 'PATCH',
    body: formData,
    credentials: 'include', // 쿠키(JWT) 포함
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

  // CommonResponse 래핑을 고려해서 data 우선 반환
  return body?.data ?? body;
}
