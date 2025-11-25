import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import PrivacyModal from '../components/PrivacyModal';
import ReqBadge from '../components/ReqBadge';
import { buildPasswordChecks } from '../utils/passwordChecks';
import { signup } from '../api/auth.api.ts';

export default function SignupFormPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL에서 email + token 둘 다 읽기
  const token = searchParams.get('token'); // URL에서 토큰만 읽음
  const emailFromUrl = searchParams.get('email') ?? ''; // 인증된 회사 이메일

  const [companyEmail, setCompanyEmail] = useState(emailFromUrl);
  const [loading, setLoading] = useState(true);

  // 필수 입력값 상태들 — 컴포넌트 "안"에서 선언
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [nickname, setNickname] = useState('');

  // 비밀번호 입력 상태

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // 모달 트리거 버튼 ref
  const openPrivacyBtnRef = useRef<HTMLButtonElement | null>(null);

  //  “개인정보 미포함” 판단에 사용할 PII 소스 구성 (이메일 local-part + 이름)
  const piiSources = [
    (companyEmail?.split('@')[0] || '').toLowerCase(),
    name.toLowerCase(),
    nickname.toLowerCase(),
  ].filter(Boolean);

  // 공통 유틸로 4가지 체크 일괄 계산
  const checks = buildPasswordChecks(password, piiSources);

  // 파생 상태: 이제야 최종 유효성 계산
  const isPasswordValid = checks.english && checks.digit && checks.length && checks.notContainsPII; // 공통 결과 사용

  const isPasswordMatch = password.length > 0 && password === passwordConfirm; // 일치
  const isRequiredFilled =
    !!companyName.trim() && !!name.trim() && !!position.trim() && !!nickname.trim(); // 반드시 boolean

  // touched 상태 추가
  const [touched, setTouched] = useState({
    companyName: false,
    name: false,
    position: false,
    nickname: false,
    password: false,
    passwordConfirm: false,
  });
  const [didSubmit, setDidSubmit] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [submitting, setSubmitting] = useState(false); // 중복 제출 막는 스위치

  //최종 유효성에 동의 포함
  const isFormValid = Boolean(
    isRequiredFilled && isPasswordValid && isPasswordMatch && consentChecked
  );

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
    //  1) 토큰 없으면 폼 진입 금지
    if (!token || !emailFromUrl) {
      alert('유효하지 않은 회원가입 링크입니다. 다시 이메일 인증을 진행해주세요.');
      navigate('/signup/email', { replace: true });
      return;
    }
    // 2) 이메일 인증 완료 API 자동 호출
    const completeEmailVerification = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/v1/auth/email-verifications/complete?token=${token}`
        );
        if (!response.ok) {
          throw new Error('이메일 인증 완료 실패');
        }

        const data = await response.json();
        console.log('이메일 인증 완료:', data);

        // URL에서 받은 이메일을 그대로 고정
        setCompanyEmail(emailFromUrl);
        setLoading(false);
      } catch (error) {
        console.error('이메일 인증 완료 실패:', error);
        alert('이메일 인증에 실패했습니다. 다시 시도해주세요.');
        navigate('/signup/email', { replace: true });
      }
    };

    completeEmailVerification();
  }, [token, emailFromUrl, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDidSubmit(true);

    if (submitting) return;

    // 텍스트 필수값 에러 수집
    const newErrors: { [key: string]: string } = {};
    if (!companyName.trim()) newErrors.companyName = '회사명을 입력해주세요.';
    if (!name.trim()) newErrors.name = '이름을 입력해주세요.';
    if (!position.trim()) newErrors.position = '직책을 입력해주세요.';
    if (!nickname.trim()) newErrors.nickname = '닉네임을 입력해주세요.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); //  필수값 미입력만 경고로 유지
      return; //  서버 전송 중단
    }

    //  최종 안전장치: 폼이 유효하지 않으면 전송 금지
    if (!isFormValid || !token) return;

    setErrors({});
    setSubmitting(true); // 전송 시작

    try {
      await signup({
        token,
        email: companyEmail,
        name,
        nickname,
        position,
        companyName,
        password,
      });

      alert('가입이 완료되었습니다. 로그인 해주세요.');
      navigate('/login', { replace: true });
    } catch (e: any) {
      //  서버에서 실패(중복 이메일, 만료 토큰 등) 시 사용자에게 안내
      console.error('회원가입 실패:', e);
      const msg =
        e?.response?.data?.message ?? '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.';
      alert(msg);
    } finally {
      setSubmitting(false); // 전송 끝
    }
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
          <label className="text-m text-jd-black block font-semibold">기업명</label>
          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
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
              className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          {(touched.companyName || didSubmit) && errors.companyName && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-red-600">
              <span aria-hidden>ⓘ</span> {errors.companyName}
            </p>
          )}
        </div>

        {/* 이름 + 직책 (2열) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* 이름 */}
          <div className="flex flex-col gap-3">
            <label className="text-m text-jd-black block font-semibold">이름</label>
            <div className="relative">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
                {/* user icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
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
                className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
                style={{ borderRadius: 15, paddingLeft: '3rem' }}
              />
            </div>
            {(touched.name || didSubmit) && errors.name && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-red-600">
                <span aria-hidden>ⓘ</span> {errors.name}
              </p>
            )}
          </div>

          {/* 직책 */}
          <div className="flex flex-col gap-3">
            <label className="text-m text-jd-black block font-semibold">직책</label>
            <div className="relative">
              <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
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
                className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
                style={{ borderRadius: 15, paddingLeft: '3rem' }}
              />
            </div>
            {(touched.position || didSubmit) && errors.position && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-red-600">
                <span aria-hidden>ⓘ</span> {errors.position}
              </p>
            )}
          </div>
        </div>

        {/* 닉네임 */}
        <div className="flex flex-col gap-3">
          <label className="text-m text-jd-black block font-semibold">닉네임</label>
          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
              {/* user icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                className="bi bi-person-lines-fill"
                viewBox="0 0 16 16"
              >
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
              </svg>
            </div>
            <input
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                if (errors.nickname) setErrors((prev) => ({ ...prev, nickname: '' }));
              }}
              onBlur={() => {
                setTouched((p) => ({ ...p, nickname: true }));
                if (!nickname.trim())
                  setErrors((prev) => ({ ...prev, nickname: '닉네임을 입력해주세요.' }));
              }}
              placeholder="닉네임을 입력하세요"
              autoComplete="off"
              name="signup-nickname"
              className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          {(touched.nickname || didSubmit) && errors.nickname && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-red-600">
              <span aria-hidden>ⓘ</span> {errors.nickname}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-3">
          <label className="text-m text-jd-black block font-semibold">비밀번호</label>
          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
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
              className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          {/* 요건 뱃지 */}
          <div className="mt-1 flex flex-wrap gap-2">
            <ReqBadge ok={checks.english} label="영문자" />
            <ReqBadge ok={checks.digit} label="숫자" />
            <ReqBadge ok={checks.length} label="8자 이상" />
            <ReqBadge ok={checks.notContainsPII} label="개인정보 미포함" />
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-3">
          <label className="text-m text-jd-black block font-semibold">비밀번호 확인</label>
          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
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
              className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
        </div>
        {/* 에러 메시지 표시 */}
        {(touched.passwordConfirm || didSubmit) &&
          passwordConfirm &&
          password !== passwordConfirm && (
            <p className="flex items-center gap-1 text-xs text-red-600">
              <span aria-hidden>ⓘ</span> 비밀번호가 일치하지 않습니다
            </p>
          )}
        {/* 개인정보 동의 섹션 */}
        <div className="mt-2">
          <label className="flex items-start gap-2 text-sm text-[#413F3F]">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="border-jd-gray-light mt-1 h-4 w-4 rounded text-[#752F6D] focus:ring-[#752F6D]"
              required
            />
            <span>
              개인정보 수집 및 이용에 동의합니다.
              <button
                type="button"
                ref={openPrivacyBtnRef} // 트리거 버튼 ref 저장
                onClick={() => setShowPrivacyModal(true)}
                className="ml-2 text-[#752F6D] underline hover:brightness-110"
              >
                자세히 보기
              </button>
            </span>
          </label>

          {didSubmit && !consentChecked && (
            <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
              <span aria-hidden>ⓘ</span> 동의가 필요합니다.
            </p>
          )}
        </div>

        {/* 모달 */}
        {showPrivacyModal && (
          <PrivacyModal
            onClose={() => setShowPrivacyModal(false)}
            title="개인정보 수집‧이용 동의"
            returnFocusRef={openPrivacyBtnRef} // 닫힐 때 포커스 복귀
          />
        )}

        {/* 회원가입 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isFormValid || submitting}
            aria-disabled={!isFormValid || submitting}
            className={`inline-flex h-12 w-40 items-center justify-center !rounded-[15px] [background-image:none] font-extrabold tracking-tight !text-white !opacity-100 transition will-change-transform outline-none select-none ${
              isFormValid
                ? '!bg-[#752F6D] shadow-[0_4px_12px_rgba(117,47,109,.25)] ' +
                  'hover:brightness-[1.05] focus-visible:ring-2 active:brightness-95 ' +
                  'focus-visible:ring-[#752F6D]/40'
                : 'cursor-not-allowed !bg-[#CDBFD4] text-[#413F3F]/60 opacity-70'
            } `}
            style={{ appearance: 'none', WebkitAppearance: 'none' }}
          >
            회원가입
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
