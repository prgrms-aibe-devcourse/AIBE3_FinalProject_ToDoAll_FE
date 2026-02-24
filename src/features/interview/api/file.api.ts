// src/features/interview/api/file.api.ts

import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

type CommonResponse<T> = {
  errorCode?: number;
  message: string;
  data: T;
};

/** 로그인 사용자(Authorization)로 presigned download url 받기 */
export async function getPresignedDownloadUrlAuthed(client: ClientRequestType, fileKey: string) {
  const raw = await client.request<CommonResponse<string>>(
    `/api/v1/files/download?fileKey=${encodeURIComponent(fileKey)}`,
    { method: 'GET' }
  );
  return raw?.data; // 너 코드 스타일에 맞춰 조정
}

/** 게스트(Interview-Token 헤더)로 presigned download url 받기 */
export async function getPresignedDownloadUrlWithGuestToken(
  fileKey: string,
  guestToken: string
): Promise<string> {
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const url = `${BASE_URL}/api/v1/files/download?fileKey=${encodeURIComponent(fileKey)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Interview-Token': guestToken,
    },
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

  // 응답이 { message, data } 형태라고 가정
  return body.data as string;
}
