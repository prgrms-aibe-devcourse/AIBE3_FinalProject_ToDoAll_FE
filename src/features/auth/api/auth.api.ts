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
  const raw = await request<any>('/api/v1/auth/token', {
    method: 'POST',
    body: JSON.stringify(dto),
  });

  // 1) 공통 응답에서 data 꺼내기 (또는 raw 자체)
  const result = unwrap<LoginResponse>(raw);

  // 2) 기본적인 타입/필수값 검증
  if (
    !result || // null / undefined
    typeof result !== 'object' ||
    typeof result.accessToken !== 'string' ||
    !result.accessToken.trim()
  ) {
    console.error('서버에서 로그인 토큰이 전달되지 않았습니다:', raw);
    throw new Error('로그인에 실패했습니다. 다시 시도해주세요.');
  }

  console.log('로그인 성공:', result);

  return result;
}

//  로그아웃 API
export async function logout() {
  await request<void>('/api/v1/auth/logout', {
    method: 'POST',
  });
}

// 로그인 전 비번 찾기
export async function requestResetEmail(email: string) {
  await request<void>('/api/v1/auth/password/reset-requests', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}
// 토큰으로 비번 찾기
export async function resetPasswordByToken(token: string, newPassword: string) {
  await request<void>('/api/v1/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

//  회원가입 전 회사 이메일 인증

// 이메일 인증 링크 요청
export async function sendCompanyVerifyLink(email: string) {
  await request<void>('/api/v1/auth/email-verifications', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

// 이메일 토큰 검증
export async function verifyCompanyEmailToken(token: string) {
  const path = `/api/v1/auth/email-verifications/complete?token=${encodeURIComponent(token)}`;
  // GET 요청 보내기
  const raw = await request<any>(path, {
    method: 'GET',
  });
  // CommonResponse 래핑해제 → data 꺼내기
  const data = unwrap<{ email: string; verifiedAt: string | null }>(raw);

  // 응답에서 verified + email을 보고, 인증된 이메일 저장
  if (data?.email) {
    // 이메일 인증이 완료된 회사 이메일을 세션 스토리지에 저장
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
  const raw = await request<any>('/api/v1/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return raw?.data ?? raw;
}
