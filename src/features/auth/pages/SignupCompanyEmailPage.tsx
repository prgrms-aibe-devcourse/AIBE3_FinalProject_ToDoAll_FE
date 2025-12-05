import type React from 'react';
import { useState } from 'react';
import AuthShell from '../components/AuthShell';
import { sendCompanyVerifyLink } from '../api/auth.api.ts';
import { ERROR_CODES } from '@features/constants/errorCodes.ts';

const PERSONAL_DOMAINS = new Set([
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
]);

export default function SignupCompanyEmailPage() {
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);
  const [loading, setLoading] = useState(false); // 전송 중 중복 클릭 방지
  const [sent, setSent] = useState(false); // 전송 완료 안내 표시
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    setError('');
    setSent(false);

    const at = value.lastIndexOf('@');
    const domain = at >= 0 ? value.slice(at + 1).toLowerCase() : '';
    // 비어있거나 개인용 도메인이면 경고
    setInvalid(Boolean(domain) && PERSONAL_DOMAINS.has(domain));
  };
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invalid || !email || loading) return; // 회사메일 아닐 때/중복 클릭 방지
    try {
      setLoading(true); // 버튼 잠금
      await sendCompanyVerifyLink(email); // 서버에 “인증 링크 보내기” 요청
      setSent(true); // 안내 메시지 노출
      setError('');
    } catch (err: any) {
      // ← catch 뒤에 (err: any) 추가
      console.error('이메일 발송 실패:', err);

      const status = err?.response?.status;
      const data = err?.response?.data;
      const backendMessage = data?.message || err?.message;
      const errorCode: number | undefined = data?.errorCode;

      let errorMessage: string;

      // 1) 이미 가입된 이메일 (백엔드 USER_ALREADY_EXISTS = 1001, HTTP 409)
      if (
        errorCode === ERROR_CODES.USER_ALREADY_EXISTS ||
        status === 409 ||
        backendMessage?.includes('이미 가입된 이메일')
      ) {
        errorMessage = '이미 가입된 이메일입니다. 로그인하시거나 비밀번호를 재설정해주세요.';
      }
      // 2) 허용되지 않은 이메일 도메인
      else if (errorCode === ERROR_CODES.EMAIL_NOT_ALLOWED || status === 422) {
        errorMessage = '허용되지 않은 이메일 도메인입니다. 회사 이메일로 다시 시도해주세요.';
      }
      // 3) 이미 인증 완료된 이메일
      else if (errorCode === ERROR_CODES.EMAIL_AUTH_ALREADY_VERIFIED) {
        errorMessage = '이미 이메일 인증이 완료된 주소입니다. 바로 로그인해주세요.';
      }
      // 4) 이미 인증 메일이 발송된 상태 (5분 제한)
      else if (errorCode === ERROR_CODES.EMAIL_AUTH_ALREADY_SENT || status === 429) {
        errorMessage = '이미 인증 메일이 발송되었습니다. 5분 후에 다시 시도해주세요.';
      }
      // 5) 요청 형식 오류
      else if (status === 400) {
        errorMessage = backendMessage || '이메일 형식이 올바르지 않습니다.';
      }
      // 6) 서버 내부 오류
      else if (status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }
      // 7) 그 외 알 수 없는 에러
      else {
        errorMessage = backendMessage || '이메일 전송에 실패했습니다. 다시 시도해주세요.';
      }

      setError(errorMessage);
      setSent(false);
    } finally {
      setLoading(false); // 버튼 잠금 해제
    }
  };

  return (
    <AuthShell>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="text-m text-jd-black block font-semibold">회사 이메일</label>

          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
              {/* mail icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
            </div>

            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="name@jobda.com"
              className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          {/* 경고 문구 */}
          {invalid && (
            <div
              id="email-warning"
              className="flex items-start gap-1 border-t border-[#D13B3B]/30 pt-2 text-[14px] leading-tight text-[#D13B3B]"
            >
              <span className="mt-[1px]">ⓘ</span>
              <span>
                기업 이메일로 가입해 주세요. 잡다는 기업 전용 채용 관리 솔루션으로 기업 이메일을
                통한 가입을 권장하고 있습니다.
              </span>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm leading-relaxed text-red-800">{error}</p>
            </div>
          )}

          {/* 성공 메시지 */}
          {sent && !invalid && !error && (
            <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">인증 이메일이 발송되었습니다!</p>
                <p className="mt-1 text-xs text-green-700">
                  <strong>{email}</strong>로 발송된 이메일을 확인하고 인증 버튼을 눌러주세요.
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!email || invalid || loading}
          className={`${
            !email || invalid || loading
              ? 'cursor-not-allowed bg-[#752F6D]/60'
              : 'bg-[#752F6D] active:brightness-95'
          } h-12 w-full !rounded-[15px] !bg-[#752F6D] [background-image:none] font-extrabold !text-white !opacity-100 shadow-[0_4px_12px_rgba(117,47,109,.25)] transition hover:brightness-[1.05] active:brightness-95`}
          style={{ height: 44 }}
        >
          {loading ? '전송 중...' : '이메일 인증'}
        </button>
      </form>
    </AuthShell>
  );
}
