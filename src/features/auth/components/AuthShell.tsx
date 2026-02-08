import { useNavigate } from 'react-router-dom';
import { type PropsWithChildren, type ReactNode } from 'react';

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
    <section
      className={`flex min-h-[560px] w-full max-w-[1120px] flex-col rounded-[25px] bg-white/30 px-6 py-10 shadow-[0_8px_40px_rgba(0,0,0,.10)] ring-1 ring-white/30 backdrop-blur-[30px] sm:px-8 md:min-h-[640px] md:px-10 md:py-[100px] ${showLeftPane ? 'justify-center' : 'justify-start'} ${cardClassName}`}
    >
      <div
        className={`grid items-center gap-10 sm:gap-14 md:gap-16 ${showLeftPane ? 'md:[grid-template-columns:520px_minmax(0,1fr)]' : ''} `}
      >
        {/* 좌측 로고/카피 */}
        {showLeftPane && (
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/logo/login-logo.png"
              alt="jobda"
              onClick={() => navigate('/login')}
              className="h-[120px] w-auto cursor-pointer drop-shadow-[0_3px_10px_rgba(0,0,0,.25)] transition-transform sm:h-[160px] md:h-[200px]"
              style={{ height: '200px' }}
            />
            {caption ? (
              <h2
                className="mt-6 text-center text-2xl leading-tight font-black tracking-tight text-white sm:text-[28px] md:text-[30px]"
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
  );
}
