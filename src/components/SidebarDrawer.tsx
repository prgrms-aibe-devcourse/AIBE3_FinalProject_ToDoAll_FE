import { Link } from 'react-router-dom';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SidebarDrawer({ open, onClose }: Props) {
  return (
    <>
      {/* 오버레이 */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-[1px] transition-opacity duration-200 z-40 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* 드로어 패널 */}
      <aside
        className={`
          fixed top-12 left-0 h-dvh w-[260px] z-50
          bg-white text-[var(--color-jd-black)]
          shadow-[0_12px_30px_rgba(0,0,0,.25)]
          ring-1 ring-[var(--color-jd-violet)]/25
          rounded-r-2xl
          translate-x-0 transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Side controller"
      >
        {/* 로고 + 슬로건 */}
        <div className="px-4 pt-4 pb-3 flex flex-col items-start gap-1">
          {/* 로고 */}
          <img src="/logo/header-logo.png" alt="jobda" className="h-18 w-auto object-contain" />

          {/* 슬로건 */}
          <span className="text-[12px] text-gray-500 font-medium text-left leading-tight">
            당신의 채용 여정에 함께하는 AI 코파일럿
          </span>
        </div>

        <div className="h-px bg-[var(--color-jd-gray-light)]" />

        {/* 메뉴 */}
        <nav className="px-3 py-3 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            {/* 아이콘 */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-violet)]"
            >
              <path
                d="M3 3h8v8H3V3Zm10 0h8v8h-8V3ZM3 13h8v8H3v-8Zm10 0h8v8h-8v-8Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm">대시보드</span>
          </Link>

          <Link
            to="/jobs"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-violet)]"
            >
              <path d="M4 6h16v12H4V6Zm4-3h8v3H8V3Z" fill="currentColor" />
            </svg>
            <span className="text-sm">공고 관리</span>
          </Link>

          <Link
            to="/candidates"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-violet)]"
            >
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm">지원자 조회</span>
          </Link>

          <Link
            to="/interviews"
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-violet)]"
            >
              <path d="M3 4h18v14H6l-3 3V4Z" fill="currentColor" />
            </svg>
            <span className="text-sm">면접 관리</span>
          </Link>
        </nav>

        {/* 하단 사용자 카드 */}
        <div className="absolute left-0 right-0 bottom-0 px-3 py-3">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--color-jd-white)] ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <img
                src="https://i.imgur.com/8Km9tLL.png"
                alt="avatar"
                className="h-9 w-9 rounded-full object-cover"
              />
              <div className="leading-tight">
                <div className="text-sm font-semibold">nickname</div>
                <div className="text-[11px] text-gray-500">abcd@d.d.kr</div>
              </div>
            </div>
            <Link
              to="/settings"
              className="p-2 rounded-md hover:bg-[var(--color-jd-gray-light)]"
              onClick={onClose}
              aria-label="설정"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="text-[var(--color-jd-black)]"
              >
                <path
                  d="M12 15.5A3.5 3.5 0 1 0 8.5 12 3.5 3.5 0 0 0 12 15.5ZM19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.5-2.4.8a7.7 7.7 0 0 0-1.7-1L14.8 2H9.2L8.7 4.8a7.7 7.7 0 0 0-1.7 1L4.6 4.9l-2 3.5L4.6 10a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.5 2.4-.8a7.7 7.7 0 0 0 1.7 1l.5 2.8h5.6l.5-2.8a7.7 7.7 0 0 0 1.7-1l2.4.8 2-3.5Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
