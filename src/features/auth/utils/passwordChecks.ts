//  비밀번호 조건 계산기
export type PwCheckFlags = {
  english: boolean;
  digit: boolean;
  length: boolean;
  notContainsPII: boolean;
};

// 기본 금지 문자열(리셋 페이지에서도 의미 있게 동작하도록)
// 필요하면 여기 배열에 팀 공통 금지어 추가 가능.
const DEFAULT_BANNED = ['admin', 'password', 'jobda'];

export function buildPasswordChecks(password: string, piiSources: string[] = []): PwCheckFlags {
  const p = (password || '').toLowerCase();

  // 1) 단순 규칙
  const english = /[A-Za-z]/.test(password);
  const digit = /[0-9]/.test(password);
  const length = password.length >= 8;

  // 2) 개인정보/금지어 포함 금지
  // - 회원가입: email local-part, nickname을 piiSources로 넣기
  // - 재설정: piiSources 없더라도 DEFAULT_BANNED로 기본 방어 동작
  const needles = [
    ...DEFAULT_BANNED,
    ...piiSources.map((s) => (s || '').toLowerCase().trim()).filter((s) => s.length >= 3), // 3글자 이상만 검사(오탐 줄이기)
  ];

  const notContainsPII = !needles.some((k) => p.includes(k));

  return { english, digit, length, notContainsPII };
}
