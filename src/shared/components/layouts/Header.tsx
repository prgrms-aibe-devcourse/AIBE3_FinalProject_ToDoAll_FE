import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarDrawer from '../SidebarDrawer.tsx';
import useFetch from '@shared/hooks/useFetch.ts';
import SelectIcon from '@shared/components/SelectIcon.tsx';

let baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

type Notice = {
  id: number;
  title: string;
  message: string;
  scheduledAt: string;
  interviewId?: number;
  readFlag?: boolean;
};

const Header = () => {
  const navigate = useNavigate();
  const [leftOpen, setLeftOpen] = useState(false);
  const [notiOpen, setNotiOpen] = useState(false);

  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('drawer-state-change', { detail: leftOpen }));
  }, [leftOpen]);

  useEffect(() => {
    const handleCloseDrawer = () => {
      setLeftOpen(false);
    };

    window.addEventListener('close-drawer', handleCloseDrawer);
    return () => {
      window.removeEventListener('close-drawer', handleCloseDrawer);
    };
  }, []);

  /** GET 알림 목록 */
  const { resData: notifications } = useFetch<
    {
      notificationId: number;
      title: string;
      message: string;
      type: string;
      scheduledAt: string;
      payload?: string;
      readFlag: boolean;
    }[]
  >('/api/v1/notifications');

  useEffect(() => {
    if (!notifications) return;
    setNotices(
      notifications.map((n) => {
        let payload: { interviewId?: number } = {};

        try {
          payload = n.payload ? JSON.parse(n.payload) : {};
        } catch (err) {
          console.error('payload parse error', err);
        }

        return {
          id: n.notificationId,
          title: n.title,
          message: n.message,
          scheduledAt: n.scheduledAt,
          interviewId: payload.interviewId,
          readFlag: n.readFlag,
        };
      })
    );
  }, [notifications]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const encodedToken = encodeURIComponent(token);

    const es = new EventSource(`${baseUrl}/api/v1/notifications/subscribe?token=${encodedToken}`);
    es.addEventListener('notification', (event) => {
      try {
        const data = JSON.parse(event.data);

        let payload: { interviewId?: number } = {};
        try {
          payload = JSON.parse(data.payload);
        } catch (err) {
          console.error('payload parse error', err);
        }

        setNotices((prev) => [
          {
            id: data.notificationId,
            title: data.title,
            message: data.message,
            scheduledAt: data.scheduledAt,
            interviewId: payload.interviewId,
            readFlag: false,
          },
          ...prev,
        ]);
      } catch (e) {
        console.log('JSON 파싱 오류', e);
      }
    });

    es.onerror = () => es.close();
    return () => es.close();
  }, []);

  // 알림 읽음 처리 함수
  const markAllAsRead = () => {
    if (notices.length === 0) return;

    setNotices((prev) => prev.map((n) => ({ ...n, readFlag: true })));

    const token = localStorage.getItem('accessToken');
    if (!token) return; // 애초에 요청 안 날리는게 나음

    fetch(`${baseUrl}/api/v1/notifications/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }).catch((err) => {
      console.error('markAllAsRead error', err);
    });
  };

  // 알림창 열릴 때 읽음 처리
  const toggleNotiOpen = () => {
    setNotiOpen((open) => {
      const newOpen = !open;
      if (newOpen) markAllAsRead();
      return newOpen;
    });
  };

  /** DELETE 요청 설정 */
  const [deleteReq, setDeleteReq] = useState<{ url: string; method: string } | null>(null);

  const { resData: deleteResult } = useFetch<any>(
    deleteReq?.url || '',
    null,
    deleteReq?.method,
    undefined
  );

  useEffect(() => {
    if (deleteResult) {
      console.log(' 개별 알림 삭제 성공', deleteResult);
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

  /** 전체 삭제 관련 Hook */
  const [delAllReq, setDelAllReq] = useState<{ url: string; method: string } | null>(null);
  const { resData: delAllResult } = useFetch<any>(
    delAllReq?.url || '',
    null,
    delAllReq?.method,
    undefined
  );

  useEffect(() => {
    if (delAllResult) {
      console.log(' 전체 알림 삭제 성공', delAllResult);
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

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      {/* 헤더 영역 */}
      <header className="fixed top-0 right-0 left-0 z-50 flex h-12 w-full items-center justify-between bg-[var(--color-jd-violet)] px-4 text-white shadow-[0_6px_22px_rgba(0,0,0,.15)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={leftOpen ? '메뉴 닫기' : '메뉴 열기'}
            onClick={() => setLeftOpen((prev) => !prev)}
          >
            <SelectIcon name={leftOpen ? 'panel-left-close' : 'panel-left-open'} />
          </button>
        </div>

        {/* 알림 버튼 */}
        <div className="relative">
          <button
            ref={notiBtnRef}
            onClick={toggleNotiOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="flex-shrink-0"
            >
              <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" />
            </svg>

            {notices.some((n) => !n.readFlag) && (
              <span className="absolute top-[2px] right-[2px] h-2.5 w-2.5 rounded-full bg-[var(--color-jd-scarlet)]"></span>
            )}
          </button>

          {/* 알림 목록 */}
          {notiOpen && (
            <div
              ref={notiMenuRef}
              className="absolute right-0 mt-2 w-[320px] rounded-2xl border bg-white shadow-lg"
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
                  <p className="py-8 text-center text-sm text-black/50">알림이 없습니다.</p>
                ) : (
                  notices.map((n) => (
                    <div
                      key={n.id}
                      className="flex cursor-pointer items-start gap-3 border-t px-4 py-3 hover:bg-gray-50"
                      onClick={() => {
                        if (n.interviewId) navigate(`/interview/${n.interviewId}/question-create`);
                        setNotiOpen(false);
                      }}
                    >
                      <div className="mt-1 text-lg">🔔</div>

                      <div className="flex-1">
                        <p className="text-sm font-medium text-black">{n.title}</p>
                        <p className="text-xs whitespace-pre-line text-black/60">{n.message}</p>
                        <p className="mt-1 text-[10px] text-gray-400">
                          {formatTime(n.scheduledAt)}
                        </p>
                      </div>

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

      {/* 헤더 높이만큼 패딩 */}
      <div className="h-12" />

      <SidebarDrawer open={leftOpen} onClose={() => setLeftOpen(false)} />
    </>
  );
};

export default Header;
