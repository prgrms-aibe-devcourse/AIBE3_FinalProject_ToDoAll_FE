import http from '../../../lib/http.ts';

export async function login(dto: { email: string; password: string }) {
  const { data } = await http.post('/v1/auth/login', dto); // baseURL + /auth/login
  if (data?.accessToken) {
    sessionStorage.setItem('accessToken', data.accessToken); // 새 토큰을 저장
  }
  return data;
}

export async function logout() {
  await http.post('/v1/auth/logout', {});
  sessionStorage.removeItem('accessToken');
}

export async function requestResetEmail(email: string) {
  await http.post('/v1/auth/password/reset-email', { email });
}

export async function resetPasswordByToken(token: string, newPassword: string) {
  await http.patch('/v1/auth/password/reset', { token, newPassword });
}
{
  /* 회원가입 전 회사 이메일 인증*/
}

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
  return res.data;
}
