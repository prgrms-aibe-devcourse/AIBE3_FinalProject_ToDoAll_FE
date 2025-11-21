//  비밀번호 조건 계산기
export type PwCheckFlags = {
  english: boolean;
  digit: boolean;
  length: boolean;
  notContainsPII: boolean;
};

const DEFAULT_BANNED = ['admin', 'password'];

export function buildPasswordChecks(password: string, piiSources: string[] = []): PwCheckFlags {
  const p = (password || '').toLowerCase();

  // 1) 단순 규칙
  const english = /[A-Za-z]/.test(password);
  const digit = /[0-9]/.test(password);
  const length = password.length >= 8;

  // 2) 개인정보/금지어 포함 금지
  const needles = [
    ...DEFAULT_BANNED,
    ...piiSources.map((s) => (s || '').toLowerCase().trim()).filter((s) => s.length >= 3), // 3글자 이상만 검사(오탐 줄이기)
  ];

  const notContainsPII = !needles.some((k) => p.includes(k));

  return { english, digit, length, notContainsPII };
}
