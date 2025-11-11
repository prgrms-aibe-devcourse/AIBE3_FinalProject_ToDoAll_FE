import { useState } from 'react';
import SidebarDrawer from '../../components/SidebarDrawer';

const Header = () => {
  const [leftOpen, setLeftOpen] = useState(false); // 왼쪽 드로어 열림/닫힘

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 z-50
          h-12 w-full
          bg-[var(--color-jd-violet)]
          text-white
          shadow-[0_6px_22px_rgba(0,0,0,.25)]
          flex items-center justify-between px-4
        "
      >
        {/* ☰ 햄버거 */}
        <div className="flex items-center gap-3">
          <button type="button" aria-label="메뉴 열기" onClick={() => setLeftOpen((prev) => !prev)}>
            <svg width="20" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        {/* 🔔 알림 버튼 */}
        <button
          type="button"
          aria-label="알림"
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-full
                     bg-white/10 hover:bg-white/15 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
            <path
              d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
              fill="currentColor"
            />
          </svg>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-jd-scarlet)]" />
        </button>
      </header>

      {/* 컨텐츠가 헤더 밑에서 시작되도록 스페이서 */}

      <div className="h-12" />

      {/*  왼쪽 사이드 컨트롤러 패널 */}
      <SidebarDrawer open={leftOpen} onClose={() => setLeftOpen(false)} />
    </>
  );
};

export default Header;
