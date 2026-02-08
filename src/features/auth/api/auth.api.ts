import { unwrap } from '@lib/utils/base.ts';
import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export async function login(dto: LoginRequest, client: ClientRequestType): Promise<LoginResponse> {
  const raw = await client.request<LoginResponse>('/api/v1/auth/token', {
    method: 'POST',
    body: dto,
  });

  const result = unwrap<LoginResponse>(raw);

  if (
    !result || // null / undefined
    typeof result !== 'object' ||
    !result.accessToken.trim()
  ) {
    console.error('서버에서 로그인 토큰이 전달되지 않았습니다:', raw);
    throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
  }

  return result;
}

export async function logout(client: ClientRequestType) {
  await client.request<void>('/api/v1/auth/logout', {
    method: 'POST',
  });
}

export async function requestResetEmail(client: ClientRequestType, email: string) {
  await client.request<void>('/api/v1/auth/password/reset-requests', {
    method: 'POST',
    body: { email },
  });
}

export async function resetPasswordByToken(
  client: ClientRequestType,
  token: string,
  newPassword: string
) {
  await client.request<void>('/api/v1/auth/password/reset', {
    method: 'POST',
    body: { token, newPassword },
  });
}

export async function sendCompanyVerifyLink(client: ClientRequestType, email: string) {
  await client.request<void>('/api/v1/auth/email-verifications', {
    method: 'POST',
    body: { email },
  });
}

/* TODO : 미사용로직 삭제
export async function verifyCompanyEmailToken(token: string) {
  const path = `/api/v1/auth/email-verifications/complete?token=${encodeURIComponent(token)}`;

  const raw = await request<any>(path, {
    method: 'GET',
  });

  const data = unwrap<{ email: string; verifiedAt: string | null }>(raw);

  if (data?.email) {
    sessionStorage.setItem('verifiedCompanyEmail', data.email);
  }
  return data;
}
*/

export async function signup(
  payload: {
    token: string;
    email: string;
    name: string;
    nickname: string;
    position: string;
    companyName: string;
    password: string;
  },
  client: ClientRequestType
) {
  const raw = await client.request<any>('/api/v1/users', {
    method: 'POST',
    body: payload,
  });

  return unwrap(raw);
}
