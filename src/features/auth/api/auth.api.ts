import { request, unwrap } from '../../../lib/utils/base';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export async function login(dto: LoginRequest): Promise<LoginResponse> {
  const raw = await request<any>('/api/v1/auth/token', {
    method: 'POST',
    body: JSON.stringify(dto),
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
  localStorage.setItem('accessToken', result.accessToken);

  console.log('로그인 성공:', result);

  return result;
}

export async function logout() {
  await request<void>('/api/v1/auth/logout', {
    method: 'POST',
  });
}

export async function requestResetEmail(email: string) {
  await request<void>('/api/v1/auth/password/reset-requests', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordByToken(token: string, newPassword: string) {
  await request<void>('/api/v1/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function sendCompanyVerifyLink(email: string) {
  await request<void>('/api/v1/auth/email-verifications', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

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

export async function signup(payload: {
  token: string;
  email: string;
  name: string;
  nickname: string;
  position: string;
  companyName: string;
  password: string;
}) {
  const raw = await request<any>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return raw?.data ?? raw;
}
