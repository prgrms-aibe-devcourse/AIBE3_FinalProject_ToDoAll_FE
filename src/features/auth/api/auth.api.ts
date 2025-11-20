import { request, unwrap } from '../../../lib/utils/base';

// 타입 정의
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

//  로그인 API
export async function login(dto: LoginRequest): Promise<LoginResponse> {
  const raw = await request<any>('/v1/auth/token', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  const { accessToken, refreshToken } = unwrap<LoginResponse>(raw) ?? {};

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }
  return { accessToken, refreshToken };
}

//  로그아웃 API
export async function logout() {
  // 1. 저장해둔 refreshToken 꺼내기
  const refreshToken =
    sessionStorage.getItem('refreshToken') || localStorage.getItem('refreshToken');

  // 2. 아예 없으면 백엔드에 굳이 안 보내고
  //    클라이언트 쪽 상태만 정리하고 끝내도 됨
  if (!refreshToken) {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return;
  }
  await request<void>('/v1/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}

// 로그인 전 비번 찾기
export async function requestResetEmail(email: string) {
  await request<void>('/v1/auth/password/reset-requests', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
// 토큰으로 비번 찾기
export async function resetPasswordByToken(token: string, newPassword: string) {
  await request<void>('/v1/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

//  회원가입 전 회사 이메일 인증

// 이메일 인증 링크 요청
export async function sendCompanyVerifyLink(email: string) {
  await request<void>('/v1/auth/email-verifications', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// 이메일 토큰 검증
export async function verifyCompanyEmailToken(token: string) {
  const path = `/v1/auth/email-verifications/complete?token=${encodeURIComponent(token)}`;
  // GET 요청 보내기
  const raw = await request<any>(path, {
    method: 'GET',
  });

  // 응답에서 verified + email을 보고, 인증된 이메일 저장
  if (raw?.verified && raw.email) {
    // 이메일 인증이 완료된 회사 이메일을 세션 스토리지에 저장
    sessionStorage.setItem('verifiedCompanyEmail', raw.email);
  }
  return raw;
}

// 회원가입 요청
export async function signup(payload: {
  token: string;
  email: string;
  name: string;
  nickname: string;
  position: string;
  companyName: string;
  password: string;
}) {
  const raw = await request<any>('/v1/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return raw?.data ?? raw;
}
