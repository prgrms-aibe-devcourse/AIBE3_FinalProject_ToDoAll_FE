import http from '../../../lib/http.ts';

export async function login(dto: { email: string; password: string }) {
  // 로그인은 인증 전이지만, 서버가 body로 accessToken, 쿠키로 refreshToken을 준다고 가정
  const { data } = await http.post('/auth/login', dto); // baseURL + /auth/login
  if (data?.accessToken) {
    sessionStorage.setItem('accessToken', data.accessToken); // 새 토큰을 저장
  }
  return data;
}

export async function logout() {
  // 서버가 refresh 쿠키를 지우고 200/204로 응답한다고 가정
  await http.post('/auth/logout', {});
  sessionStorage.removeItem('accessToken'); // 클라 보관 토큰도 지워 깔끔하게 마무리
}

export async function requestResetEmail(email: string) {
  // 비로그인 사용자도 접근 가능
  await http.post('/auth/password/reset-email', { email });
}

export async function resetPasswordByToken(token: string, newPassword: string) {
  // 메일 링크의 토큰으로 새 비번을 만든다.
  await http.patch('/auth/password/reset', { token, newPassword });
}
{
  /* 회원가입 전 회사 이메일 인증*/
}

// 이메일 인증 링크 요청
export async function sendCompanyVerifyLink(email: string) {
  // 백엔드 엔드포인트: POST /auth/company-email/verify-link { email }
  // 응답: 204 (성공) or { message: 'sent' }
  await http.post('/auth/company-email/verify-link', { email });
}

// 이메일 토큰 검증
export async function verifyCompanyEmailToken(token: string) {
  // 백엔드 엔드포인트: GET /auth/company-email/verify?token=xxxx
  const { data } = await http.get(`/auth/company-email/verify?token=${token}`);
  // 서버가 { verified: true, email: 'user@company.com' } 형태로 내려준다고 가정
  if (data?.verified && data.email) {
    sessionStorage.setItem('verifiedCompanyEmail', data.email);
  }
  return data;
}
