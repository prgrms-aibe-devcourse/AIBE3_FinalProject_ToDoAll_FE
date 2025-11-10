// src/features/auth/pages/SignupFormPage.tsx
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

export default function SignupFormPage() {
  const [searchParams] = useSearchParams();

  // 개발용: 토큰 없으면 자동으로 'dev-token' 사용
  const token = searchParams.get('token') || 'dev-token';

  const [companyEmail, setCompanyEmail] = useState('');
  const [loading, setLoading] = useState(true);

  // 필수 입력값 상태들 — 컴포넌트 "안"에서 선언
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 비밀번호 입력 상태

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 검증 함수 먼저 선언
  const validatePassword = (pw: string) => /[a-zA-Z]/.test(pw) && /\d/.test(pw) && pw.length >= 8;

  // 비밀번호 요건 체크(대/소문자, 숫자, 특수문자, 길이)
  const pwChecks = {
    english: /[a-zA-Z]/.test(password),
    digit: /\d/.test(password),
    length: password.length >= 8,
  };

  // “개인정보 미포함” (회사 이메일/이름 조합이 비밀번호에 들어가면 위험)
  const piiTokens = [companyEmail?.split('@')[0] || ''].filter(Boolean);
  const notContainsPII = !piiTokens.some(
    (t) => t && password.toLowerCase().includes(t.toLowerCase())
  );

  // 파생 상태: 이제야 최종 유효성 계산
  const isPasswordValid = validatePassword(password); // 영어+숫자+8자
  const isPasswordMatch = password.length > 0 && password === passwordConfirm; // 일치
  const isRequiredFilled = !!companyName.trim() && !!name.trim() && !!position.trim(); // 반드시 boolean
  const isFormValid = Boolean(
    isRequiredFilled && isPasswordValid && isPasswordMatch && notContainsPII
  );

  // touched 상태 추가
  const [touched, setTouched] = useState({
    companyName: false,
    name: false,
    position: false,
    password: false,
    passwordConfirm: false,
  });
  const [didSubmit, setDidSubmit] = useState(false);

  // 공통 헬퍼: onBlur 시 즉석 에러 세팅
  const setFieldError = (key: 'companyName' | 'name' | 'position', value: string) => {
    setErrors((prev) => ({
      ...prev,
      [key]: value.trim()
        ? ''
        : key === 'companyName'
          ? '회사명을 입력해주세요.'
          : key === 'name'
            ? '이름을 입력해주세요.'
            : '직책을 입력해주세요.',
    }));
  };

  useEffect(() => {
    // 개발 중엔 서버 요청 대신 임시 이메일 세팅
    const fakeEmail = 'developer@jobda.com';
    setCompanyEmail(fakeEmail);
    setLoading(false);
  }, [token]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDidSubmit(true);

    // 텍스트 필수값 에러 수집
    const newErrors: { [key: string]: string } = {};
    if (!companyName.trim()) newErrors.companyName = '회사명을 입력해주세요.';
    if (!name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!position.trim()) newErrors.position = '직책을 입력해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); //  필수값 미입력만 경고로 유지
      return; //  서버 전송 중단
    }

    // 2) 최종 안전장치: 폼이 유효하지 않으면 전송 금지
    if (!isFormValid) return;

    setErrors({});
    // TODO: 회원가입 요청 (token과 함께 전송)
    console.log('회원가입 제출:', {
      companyEmail,
      companyName,
      name,
      position,
      passwordLen: password.length,
    });
  };

  if (loading) {
    return (
      <AuthShell>
        <div className="text-center text-[#413F3F]">로딩 중...</div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* 기업명 */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">기업명</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="text-[#413F3F]"
              >
                <path
                  d="M4 22h16v-2h-1V4a1 1 0 0 0-1-1h-4V2h-4v1H6a1 1 0 0 0-1
                1v16H4v2zm3-2V5h10v15H7zM9 7h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-8h2v2h-2V7zm0
                4h2v2h-2v-2zm0 4h2v2h-2v-2z"
                />
              </svg>
            </div>
            <input
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value); // ← 상태 실제 사용
                if (errors.companyName) {
                  setErrors((prev) => ({ ...prev, companyName: '' }));
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, companyName: true }));
                setFieldError('companyName', companyName);
              }}
              placeholder="회사명을 입력하세요"
              className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          {(touched.companyName || didSubmit) && errors.companyName && (
            <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
              <span aria-hidden>ⓘ</span> {errors.companyName}
            </p>
          )}
        </div>

        {/* 이름 + 직책 (2열) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 이름 */}
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-semibold text-jd-black">이름</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
                {/* user icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87M4 21v-2a4 4 0 0 1 3-3.87m9-7.13a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
                </svg>
              </div>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value); // ← 상태 실제 사용
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: '' }));
                    setFieldError('name', name);
                  }
                }}
                onBlur={() => {
                  setTouched((p) => ({ ...p, name: true }));
                  setFieldError('name', name);
                }}
                placeholder="이름을 입력하세요"
                autoComplete="off"
                name="signup-name"
                className="h-12 w-full rounded-full border border-jd-gray-light bg-jd-white pl-12 pr-5 text-[#413F3F]
        placeholder:text-jd-gray-dark/70 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
        focus:border-jd-gray-light focus:ring-0"
                style={{ borderRadius: 15, paddingLeft: '3rem' }}
              />
            </div>
            {(touched.name || didSubmit) && errors.name && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                <span aria-hidden>ⓘ</span> {errors.name}
              </p>
            )}
          </div>

          {/* 직책 */}
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-semibold text-jd-black">직책</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
                {/* briefcase icon (18x18, currentColor) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 64 64"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M26 6c-2.18 0-4 1.82-4 4v2H5v17c0 2.21 1.79 4 4 4h19v-4h8v4h19c2.21 0 4-1.79 4-4V12H42v-2c0-2.18-1.82-4-4-4H26zm0 4h12v2H26v-2zm4 21v6h4v-6h-4zM5 35v15c0 2.21 1.79 4 4 4h46c2.21 0 4-1.79 4-4V36l-23-.43V39h-8v-3.57L5 35z" />
                </svg>
              </div>
              <input
                value={position}
                onChange={(e) => {
                  setPosition(e.target.value); // ← 상태 실제 사용
                  if (errors.position) {
                    setErrors((prev) => ({ ...prev, position: '' }));
                  }
                }}
                onBlur={() => {
                  setTouched((p) => ({ ...p, position: true }));
                  setFieldError('position', position);
                }}
                placeholder="예: 매니저"
                name="user_field"
                autoComplete="off"
                className="h-12 w-full rounded-full border border-jd-gray-light bg-jd-white pl-12 pr-5 text-[#413F3F]
        placeholder:text-jd-gray-dark/70 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
        focus:border-jd-gray-light focus:ring-0"
                style={{ borderRadius: 15, paddingLeft: '3rem' }}
              />
            </div>
            {(touched.position || didSubmit) && errors.position && (
              <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                <span aria-hidden>ⓘ</span> {errors.position}
              </p>
            )}
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">비밀번호</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2
                2 0 0 0-2-2Zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm3.1-9H8.9V6a3.1 3.1 0 1 1 6.2 0v2Z"
                />
              </svg>
            </div>
            <input
              type="password"
              placeholder="영문자, 숫자 8자 이상"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, password: true }))}
              minLength={8}
              autoComplete="new-password"
              autoCapitalize="none"
              spellCheck={false}
              className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          {/* 요건 뱃지 */}
          <div className="mt-1 flex flex-wrap gap-2">
            <ReqBadge ok={pwChecks.english} label="영문자" />
            <ReqBadge ok={pwChecks.digit} label="숫자" />
            <ReqBadge ok={pwChecks.length} label="8자 이상" />
            <ReqBadge ok={notContainsPII} label="개인정보 미포함" />
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">비밀번호 확인</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2
                2 0 0 0-2-2Zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm3.1-9H8.9V6a3.1 3.1 0 1 1 6.2 0v2Z"
                />
              </svg>
            </div>
            <input
              type="password"
              placeholder="비밀번호를 한 번 더 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              onBlur={() => setTouched((p) => ({ ...p, passwordConfirm: true }))}
              autoComplete="new-password"
              autoCapitalize="none"
              spellCheck={false}
              className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
        </div>
        {/* 에러 메시지 표시 */}
        {(touched.passwordConfirm || didSubmit) &&
          passwordConfirm &&
          password !== passwordConfirm && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <span aria-hidden>ⓘ</span> 비밀번호가 일치하지 않습니다
            </p>
          )}

        {/* 회원가입 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
            className={`
              inline-flex items-center justify-center
              h-12 w-40 select-none
              !rounded-[15px] !text-white font-extrabold tracking-tight
              [background-image:none] !opacity-100
              shadow-[0_4px_12px_rgba(117,47,109,.25)]
              transition will-change-transform outline-none
              ${
                isFormValid
                  ? '!bg-[#752F6D] hover:brightness-[1.05] active:brightness-95 focus-visible:ring-2 focus-visible:ring-[#752F6D]/40'
                  : '!bg-[#E3DBDB] text-[#413F3F]/60 cursor-not-allowed opacity-70'
              }
          `}
            style={{ appearance: 'none', WebkitAppearance: 'none' }}
          >
            회원가입
          </button>
        </div>
      </form>
    </AuthShell>
  );
}

function ReqBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full
        !px-2.5 !py-1.5 text-[11.5px] font-medium leading-[1.1]
        border border-transparent
        ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}
        shadow-sm`}
    >
      {ok ? '✓' : '✕'}&nbsp;{label}
    </span>
  );
}
