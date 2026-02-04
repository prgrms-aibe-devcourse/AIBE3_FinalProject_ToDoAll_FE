import React, { useState, useContext } from 'react';
import { AuthContext } from '@/AuthContext.ts';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api.ts';
import { useAuthedClient } from '@shared/hooks/useAuthClient.ts';
import AuthShell from '@features/auth/components/AuthShell.tsx';
import { useAlertStore } from '@shared/store/useAlertStore.ts';

export default function LoginPage() {
  const { setToken } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const client = useAuthedClient();

  const openAlertModal = useAlertStore((s) => s.action.openAlertModal);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); // 중복 클릭을 방지
    const form = new FormData(e.target as HTMLFormElement);
    const email = String(form.get('email') || ''); // 비어 있으면 공백 문자열
    const password = String(form.get('password') || '');
    try {
      const result = await login({ email, password }, client); // 서버에서 accessToken을 받기
      setToken(result.accessToken, result.refreshToken);
    } catch {
      openAlertModal({
        type: 'error',
        title: '로그인 실패',
        message: '이메일 또는 비밀번호를 확인해 주세요.',
      });
    } finally {
      setSubmitting(false); // 버튼 비활성화를 해제
      window.location.href = '/dashboard';
    }
  };

  return (
    <AuthShell
      caption={
        <>
          잡다와 함께 효율적인
          <br />
          채용을 경험해보세요.
        </>
      }
    >
      <div className="md:-translate-x-8">
        <form onSubmit={onSubmit} className="flex w-full flex-col gap-8">
          {/* 입력 필드 그룹 */}
          <div className="flex flex-col gap-8 sm:gap-10">
            {/* 이메일 */}
            <div className="flex flex-col gap-3">
              <label htmlFor="email" className="text-m text-jd-black block font-semibold">
                계정 이메일
              </label>
              <div className="relative">
                <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-[#413F3F]">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@jobda.com"
                  className="border-jd-gray-light text-jd-black placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border bg-transparent pr-5 pl-12 shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] backdrop-blur-md outline-none focus:bg-transparent focus:ring-0"
                  style={{
                    borderRadius: 15,
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                  }}
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div className="flex flex-col gap-3">
              <label htmlFor="password" className="text-m text-jd-black block font-semibold">
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-[#413F3F]">
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0
                          2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71
                          1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="border-jd-gray-light text-jd-black placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border bg-transparent pr-5 pl-12 shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] backdrop-blur-md outline-none focus:bg-transparent focus:ring-0"
                  style={{
                    borderRadius: 15,
                    paddingLeft: '3rem',
                    paddingRight: '1rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={submitting}
            className="relative z-10 h-[44px] w-full !rounded-[15px] !bg-[#F7A534] [background-image:none] !text-white opacity-100 shadow-[0_4px_12px_rgba(247,165,52,.25)] transition hover:brightness-[1.05] active:brightness-95"
          >
            <span
              className="login-btn-text text-[17px] font-semibold"
              style={{ fontVariationSettings: "'wght' 800" }}
            >
              {submitting ? '로그인 중...' : '로그인'}
            </span>
          </button>

          {/* 하단 링크 */}
          <div className="mt-[-20px] text-center text-sm text-[#413F3F]">
            <button
              type="button"
              onClick={() => navigate('/forgot')}
              className="cursor-pointer underline-offset-2 hover:underline"
            >
              비밀번호 찾기
            </button>

            <span className="mx-1.5 opacity-50"> | </span>

            <button
              type="button"
              onClick={() => navigate('/signup/email')}
              className="cursor-pointer underline-offset-2 hover:underline"
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </AuthShell>
  );
}
