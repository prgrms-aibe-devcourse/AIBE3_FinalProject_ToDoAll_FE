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
