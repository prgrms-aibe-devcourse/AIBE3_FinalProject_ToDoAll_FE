import { useState, useRef, useEffect } from 'react';
import SidebarDrawer from '../../components/SidebarDrawer';
import useFetch from '@/hooks/useFetch';

type Notice = {
  id: number;
  text: string;
  avatarUrl?: string;
};

const Header = () => {
  const [leftOpen, setLeftOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

  const [notices, setNotices] = useState<Notice[]>([]);

  /** 📌 GET 알림 목록 */
  const { resData: notifications } = useFetch<
    {
      notificationId: number;
      title: string;
      message: string;
      type: string;
      createdAt: string;
    }[]
  >('/api/v1/notifications');

  useEffect(() => {
    if (!notifications) return;
    setNotices(
      notifications.map((n) => ({
        id: n.notificationId,
        text: `${n.title} - ${n.message}`,
        avatarUrl: '/default-avatar.png',
      }))
    );
  }, [notifications]);

  /** 📌 DELETE 요청 설정 */
  const [deleteReq, setDeleteReq] = useState<{ url: string; method: string } | null>(null);

  const { resData: deleteResult } = useFetch<any>(
    deleteReq?.url || '',
    null,
    deleteReq?.method,
    undefined
  );

  useEffect(() => {
    if (deleteResult) {
      console.log('✔ 개별 알림 삭제 성공', deleteResult);
    }
  }, [deleteResult]);

  const removeNotice = (id: number) => {
    setDeleteReq({
      url: `/api/v1/notifications/${id}`,
      method: 'DELETE',
    });

    // 화면 즉시 반영
    setNotices((list) => list.filter((n) => n.id !== id));
  };

  /** 🔥 전체 삭제 관련 Hook */
  const [delAllReq, setDelAllReq] = useState<{ url: string; method: string } | null>(null);
  const { resData: delAllResult } = useFetch<any>(
    delAllReq?.url || '',
    null,
    delAllReq?.method,
    undefined
  );

  useEffect(() => {
    if (delAllResult) {
      console.log('✔ 전체 알림 삭제 성공', delAllResult);
      setNotices([]);
    }
  }, [delAllResult]);

  const clearAll = () => {
    if (notices.length === 0) return;
    setDelAllReq({
      url: '/api/v1/notifications',
      method: 'DELETE',
    });
  };

  /** 드롭다운 외부 클릭 */
  const notiBtnRef = useRef<HTMLButtonElement | null>(null);
  const notiMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!notiOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (notiMenuRef.current?.contains(t)) return;
      if (notiBtnRef.current?.contains(t)) return;
      setNotiOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [notiOpen]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-50 flex h-12 w-full items-center justify-between bg-[var(--color-jd-violet)] px-4 text-white shadow-[0_6px_22px_rgba(0,0,0,.15)]">
        <div className="flex items-center gap-3">
          <button type="button" aria-label="메뉴 열기" onClick={() => setLeftOpen((prev) => !prev)}>
            <svg width="20" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            aria-label="알림"
            aria-haspopup="menu"
            aria-expanded={notiOpen}
            ref={notiBtnRef}
            onClick={() => setNotiOpen((v) => !v)}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white">
              <path
                d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                fill="currentColor"
              />
            </svg>
            {notices.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[var(--color-jd-scarlet)]" />
            )}
          </button>

          {notiOpen && (
            <div
              ref={notiMenuRef}
              className="absolute right-0 z-[60] mt-2 w-[320px] rounded-2xl border bg-white shadow-lg"
            >
              <div className="flex items-center justify-between px-4 py-2">
                <p className="text-sm font-semibold text-black">알림</p>
                <button
                  onClick={clearAll}
                  className="rounded-md px-2 py-1 text-xs text-black/60 hover:bg-black/10"
                >
                  모두 지우기
                </button>
              </div>

              <div className="max-h-[320px] overflow-auto">
                {notices.length === 0 ? (
                  <p className="px-4 py-8 text-center text-sm text-black/50">알림이 없습니다.</p>
                ) : (
                  notices.map((n) => (
                    <div key={n.id} className="flex items-start gap-3 border-t px-4 py-3">
                      <img src={n.avatarUrl} className="h-8 w-8 rounded-full object-cover" />
                      <p className="flex-1 text-sm text-black">{n.text}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotice(n.id);
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-black/40 hover:bg-black/10"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="h-12" />
      <SidebarDrawer open={leftOpen} onClose={() => setLeftOpen(false)} />
    </>
  );
};

export default Header;
