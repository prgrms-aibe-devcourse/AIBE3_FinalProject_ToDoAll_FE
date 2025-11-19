import http from '../../../lib/http.ts'; // 공통 래퍼 사용

export async function getMe() {
  // 로그인 후에만 접근 가능한 내 정보 API
  const { data } = await http.get('/v1/users/me');
  return data.data; // 페이지에서 그대로 setState하기 쉽도록 raw로 반환
}

export async function updateMe(payload: {
  name?: string;
  phoneNumber?: string;
  position?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  nickname?: string;
}) {
  const { data } = await http.patch('/v1/users/me', payload);
  return data.data; // 서버가 최신 데이터를 다시 내려주면 그대로 반영할 수 있음
}

export async function changePassword(currentPassword: string, newPassword: string) {
  // 로그인 후 "내 비번 변경" — 인증 필요
  await http.patch('/v1/users/me/password', { currentPassword, newPassword });
}
