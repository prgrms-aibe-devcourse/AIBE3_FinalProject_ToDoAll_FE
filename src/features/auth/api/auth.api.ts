import http from '../../../lib/http.ts';

// 타입 정의
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}

//  로그인
export async function login(dto: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post('/v1/auth/token', dto);

  const { accessToken, refreshToken } = data.data ?? {};

  if (accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  }

  if (refreshToken) {
    sessionStorage.setItem('refreshToken', refreshToken);
  }
  return { accessToken, refreshToken };
}

//  로그아웃
export async function logout() {
  await http.post('/v1/auth/logout', {});
  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
}

// 로그인 전 비번 찾기
export async function requestResetEmail(email: string) {
  await http.post('/v1/auth/password/reset-requests', { email });
}

export async function resetPasswordByToken(token: string, newPassword: string) {
  await http.post('/v1/auth/password/reset', { token, newPassword });
}

//  회원가입 전 회사 이메일 인증

// 이메일 인증 링크 요청
export async function sendCompanyVerifyLink(email: string) {
  await http.post('/v1/auth/email-verifications', { email });
}

// 이메일 토큰 검증
export async function verifyCompanyEmailToken(token: string) {
  const { data } = await http.get('/v1/auth/email-verifications/complete', { params: { token } });

  if (data?.verified && data.email) {
    sessionStorage.setItem('verifiedCompanyEmail', data.email);
  }
  return data;
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
  const res = await http.post('/v1/users', payload);
  return res.data.data ?? res.data;
}
