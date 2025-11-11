import { useState, useRef, useEffect } from 'react';
import SidebarDrawer from '../../components/SidebarDrawer';

type Notice = {
  id: string;
  avatarUrl?: string;
  text: string;
};

const Header = () => {
  const [leftOpen, setLeftOpen] = useState(false); // 왼쪽 드로어 열림/닫힘
  const [notiOpen, setNotiOpen] = useState(false); // 알림 드롭다운 열림/닫힘

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: 'n1',
      avatarUrl: 'https://i.pravatar.cc/32?img=5',
      text: '김말수 님의 면접(2025-02-12)이 하루 남았습니다.',
    },
    {
      id: 'n2',
      avatarUrl: 'https://i.pravatar.cc/32?img=7',
      text: '김영희 님의 면접(2025-02-12)이 하루 남았습니다.',
    },
  ]);

  const notiBtnRef = useRef<HTMLButtonElement | null>(null); // 알림 버튼 참조
  const notiMenuRef = useRef<HTMLDivElement | null>(null); // 알림 메뉴 박스 참조

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    if (!notiOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (notiMenuRef.current?.contains(t)) return; // 메뉴 안쪽 클릭이면 유지
      if (notiBtnRef.current?.contains(t)) return; // 버튼 클릭이면 유지
      setNotiOpen(false); // 그 외는 닫기
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick); // 언마운트/닫힐 때 정리
  }, [notiOpen]);

  // 개별 알림 지우기
  const removeNotice = (id: string) => {
    setNotices((list) => list.filter((n) => n.id !== id));
  };

  // 모두 지우기
  const clearAll = () => {
    setNotices([]);
  };

  return (
    <>
      <header
        className="
          fixed top-0 left-0 right-0 z-50
          h-12 w-full
          bg-[var(--color-jd-violet)]
          text-white
          shadow-[0_6px_22px_rgba(0,0,0,.15)]
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
        <div className="relative">
          <button
            type="button"
            aria-label="알림"
            aria-haspopup="menu"
            aria-expanded={notiOpen}
            onClick={() => setNotiOpen((v) => !v)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full
                       bg-white/10 hover:bg-white/15 transition  focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path
                d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                fill="currentColor"
              />
            </svg>
            {notices.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-jd-scarlet)]" />
            )}
          </button>

          {/* 알림 드롭다운 */}
          {notiOpen && (
            <div
              ref={notiMenuRef}
              role="menu"
              aria-label="알림 목록"
              className="
                  absolute right-0 mt-2 w-[320px]
                  rounded-2xl border border-black/10 bg-white
                  shadow-[0_10px_30px_rgba(0,0,0,.15)]
                  z-[60] overflow-hidden
                "
            >
              <div className="flex items-center justify-between px-4 py-2">
                <p className="text-sm font-semibold text-[var(--color-jd-black)]">알림</p>
                <button
                  onClick={clearAll}
                  className="rounded-md px-2 py-1 text-xs text-black/60 hover:bg-black/5"
                >
                  모두 지우기
                </button>
              </div>

              <div className="max-h-[320px] overflow-auto">
                {notices.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-black/50">알림이 없습니다.</p>
                ) : (
                  notices.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 border-t border-black/5 px-4 py-3 first:border-t-0"
                    >
                      <img
                        src={n.avatarUrl}
                        alt=""
                        className="mt-0.5 h-8 w-8 rounded-full object-cover"
                      />
                      <p className="flex-1 text-sm leading-5 text-black/80">{n.text}</p>
                      <button
                        title="이 알림 지우기"
                        onClick={(e) => {
                          e.stopPropagation(); // 드문 케이스에서 부모 클릭 전파 방지
                          removeNotice(n.id);
                        }}
                        className="ml-1 mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-black/40 hover:bg-black/5"
                        aria-label="알림 삭제"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* 말풍선 꼬리 */}
              <div className="pointer-events-none absolute -top-2 right-6 h-4 w-4 rotate-45 rounded-sm bg-white shadow-[-2px_-2px_2px_rgba(0,0,0,.04)]" />
            </div>
          )}
        </div>
      </header>

      {/* 컨텐츠가 헤더 밑에서 시작되도록 스페이서 */}
      <div className="h-12" />

      {/*  왼쪽 사이드 컨트롤러 패널 */}
      <SidebarDrawer open={leftOpen} onClose={() => setLeftOpen(false)} />
    </>
  );
};

export default Header;
