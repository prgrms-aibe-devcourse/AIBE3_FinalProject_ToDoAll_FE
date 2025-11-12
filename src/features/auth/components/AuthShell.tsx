import { useNavigate } from 'react-router-dom';
import type { PropsWithChildren, ReactNode } from 'react';

type AuthShellProps = PropsWithChildren<{
  withVideo?: boolean; // 로그인에서만 true
  showLeftPane?: boolean; // 좌측 로고/카피 영역 표시 여부
  caption?: ReactNode; // 로고 아래 문구
  cardClassName?: string; // 카드에 추가 클래스
}>;

export default function AuthShell({
  showLeftPane = true,
  caption,
  cardClassName = '',
  children,
}: AuthShellProps) {
  const navigate = useNavigate();

  const rightPaneClass = showLeftPane
    ? 'w-full md:-translate-x-10'
    : 'mx-auto w-full max-w-[520px]';

  return (
    <div className="relative min-h-dvh w-full overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(100%_100%_at_50%_0%,#eeeeef_0%,#dcdcdc_35%,#d6d6d6_60%,#cfcfcf_100%)]">
        <div
          className="absolute inset-0 bg-center bg-cover opacity-30"
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

      {/* 글래스 카드 */}
      <main className="relative z-10 grid min-h-dvh place-items-center px-4 sm:px-6 md:px-8">
        <section
          className={`w-full max-w-[1120px] rounded-[25px]
            bg-white/30 backdrop-blur-[30px] ring-1 ring-white/30
            shadow-[0_8px_40px_rgba(0,0,0,.10)]
            px-6 sm:px-8 md:px-10 py-10 md:py-[100px] min-h-[560px] md:min-h-[640px]
            flex flex-col ${showLeftPane ? 'justify-center' : 'justify-start'}
            ${cardClassName}`}
        >
          <div
            className={`
            grid items-center gap-10 sm:gap-14 md:gap-16
            ${showLeftPane ? 'md:[grid-template-columns:520px_minmax(0,1fr)]' : ''}
          `}
          >
            {/* 좌측 로고/카피 */}
            {showLeftPane && (
              <div className="flex flex-col items-center justify-center text-center">
                <img
                  src="/logo/login-logo.png"
                  alt="jobda"
                  onClick={() => navigate('/login')}
                  className="w-auto cursor-pointer drop-shadow-[0_3px_10px_rgba(0,0,0,.25)]
                             transition-transform h-[120px] sm:h-[160px] md:h-[200px]"
                  style={{ height: '200px' }}
                />
                {caption ? (
                  <h2
                    className="mt-6 text-center font-black leading-tight tracking-tight text-white text-2xl sm:text-[28px] md:text-[30px]"
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
