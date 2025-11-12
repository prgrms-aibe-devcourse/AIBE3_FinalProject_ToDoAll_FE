// src/features/auth/components/AuthShell.tsx
import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { PropsWithChildren, ReactNode } from 'react';

type AuthShellProps = PropsWithChildren<{
  withVideo?: boolean; // 로그인에서만 true
  showLeftPane?: boolean; // 좌측 로고/카피 영역 표시 여부
  caption?: ReactNode; // 로고 아래 문구
  cardClassName?: string; // 카드에 추가 클래스
}>;

export default function AuthShell({
  withVideo = false,
  showLeftPane = true,
  caption,
  cardClassName = '',
  children,
}: AuthShellProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!withVideo) return;
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else void v.play();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [withVideo]);

  const rightPaneClass = showLeftPane
    ? 'w-full -translate-x-6 md:-translate-x-10'
    : 'mx-auto w-full max-w-[520px]';

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      {/* 배경: 비디오 or 회색 ‘사진 톤’ */}
      {withVideo ? (
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
      ) : (
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(100%_100%_at_50%_0%,#eeeeef_0%,#dcdcdc_35%,#d6d6d6_60%,#cfcfcf_100%)]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/images/auth-still.jpg')",
              filter: 'blur(2px)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' " +
                "viewBox='0 0 64 64'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' " +
                "stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='.25'/></svg>\")",
            }}
          />
        </div>
      )}

      {/* 글래스 카드 */}
      <main className="relative z-10 grid min-h-dvh place-items-center px-4">
        <section
          className={`flex min-h-[640px] w-full max-w-[1120px] flex-col rounded-[25px] bg-white/30 px-10 py-[80px] shadow-[0_8px_40px_rgba(0,0,0,.10)] ring-1 ring-white/30 backdrop-blur-[30px] md:py-[100px] ${showLeftPane ? 'justify-center' : 'justify-start'} ${cardClassName}`}
        >
          <div
            className={`grid items-center gap-16 ${showLeftPane ? 'md:grid-cols-[520px_480px]' : ''} `}
          >
            {/* 좌측 로고/카피 */}
            {showLeftPane && (
              <div className="flex flex-col items-center justify-center text-center">
                <img
                  src="/logo/login-logo.png"
                  alt="jobda"
                  onClick={() => navigate('/login')}
                  className="w-auto cursor-pointer drop-shadow-[0_3px_10px_rgba(0,0,0,.25)] transition-transform"
                  style={{ height: '200px' }}
                />
                {caption ? (
                  <h2
                    className="mt-6 text-center leading-tight font-black tracking-tight text-white"
                    style={{
                      fontSize: '30px',
                      fontWeight: 600,
                      textShadow: '0 3px 18px rgba(0,0,0,0.4)',
                      WebkitFontSmoothing: 'antialiased',
                    }}
                  >
                    {caption}
                  </h2>
                ) : null}
              </div>
            )}

            {/* 우측(또는 전체) 컨텐츠 */}
            <div className={rightPaneClass}>{children}</div>
          </div>
        </section>
      </main>
    </div>
  );
}
