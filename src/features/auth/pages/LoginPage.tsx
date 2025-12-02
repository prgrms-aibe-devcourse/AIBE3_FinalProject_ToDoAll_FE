import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api.ts';
import AlertModal from '@components/Alertmodal.tsx';

export default function LoginPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [alertModal, setAlertModal] = useState({
    open: false,
    type: 'error' as 'success' | 'error' | 'info' | 'warning',
    message: '',
  });

  const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'error') => {
    setAlertModal({ open: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else v.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.preventDefault();
    setSubmitting(true); // 중복 클릭을 방지
    const form = new FormData(e.target as HTMLFormElement);
    const email = String(form.get('email') || ''); // 비어 있으면 공백 문자열
    const password = String(form.get('password') || '');
    try {
      await login({ email, password }); // 서버에서 accessToken을 받기
      window.location.href = '/dashboard'; // 다음 단계(E2E 스모크)를 바로 확인
    } catch {
      showAlert('이메일 또는 비밀번호를 확인해 주세요.', 'error');
    } finally {
      setSubmitting(false); // 버튼 비활성화를 해제
    }
  };

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* 배경 비디오 */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="pointer-events-none fixed inset-0 h-full w-full object-cover"
      >
        <source src="/videos/login-bg.mp4" type="video/mp4" />
      </video>

      {/* 글래스 카드 */}
      <main className="relative z-10 grid min-h-dvh place-items-center px-4 sm:px-6 md:px-8">
        <section className="flex min-h-[560px] w-full max-w-[1120px] flex-col justify-center rounded-[24px] bg-white/[0.15] px-6 py-10 shadow-[0_24px_70px_rgba(0,0,0,.28)] ring-1 ring-white/[0.15] backdrop-blur-[20px] sm:px-8 md:min-h-[640px] md:px-10 md:py-12">
          {/* 좌측 520px / 우측 480px, 사이 간격 64px */}
          <div className="grid items-center gap-10 sm:gap-14 md:[grid-template-columns:520px_minmax(0,1fr)] md:gap-16">
            {/* 좌측: 로고 + 카피 (정중앙 정렬) */}
            <div className="flex flex-col items-center justify-center text-center">
              <img
                src="/logo/login-logo.png"
                alt="jobda"
                className="h-[120px] w-auto drop-shadow-[0_3px_10px_rgba(0,0,0,.35)] sm:h-[160px] md:h-[200px]"
                style={{ height: '200px' }}
              />
              <h2
                className="mt-6 text-center text-2xl leading-tight font-black tracking-tight text-white sm:text-[28px] md:text-[30px]"
                style={{
                  fontWeight: 600,
                  textShadow: '0 3px 18px rgba(0,0,0,0.4)',
                  WebkitFontSmoothing: 'antialiased',
                }}
              >
                잡다와 함께 효율적인 채용을
                <br />
                경험해 보세요
              </h2>
            </div>

            {/* 우측: 폼 */}
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
          </div>
        </section>
      </main>

      <AlertModal
        open={alertModal.open}
        type={alertModal.type}
        message={alertModal.message}
        onClose={closeAlert}
      />
    </div>
  );
}
