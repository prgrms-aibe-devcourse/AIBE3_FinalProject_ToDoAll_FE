import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ConfirmLogoutModal from '../features/user/components/ConfirmLogoutModal.tsx';
import { getMe } from '../features/user/api/user.api.ts';
import { logout } from '../features/auth/api/auth.api.ts';
import { API_ORIGIN } from '@lib/utils/base.ts';

type Props = {
  open: boolean;
  onClose: () => void;
};

type DrawerUser = {
  nickname: string;
  email: string;
  profileUrl: string | null;
};

export default function SidebarDrawer({ open, onClose }: Props) {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [user, setUser] = useState<DrawerUser | null>(null);
  const avatarUrl = user?.profileUrl || `${API_ORIGIN}/images/default-profile.jpg`;

  useEffect(() => {
    // 드로어가 열려 있을 때만 불러와도 되고, 한 번만 불러와도 됨
    getMe()
      .then((data) => {
        const userData = data as {
          nickname?: string | null;
          email?: string | null;
          profileUrl?: string | null;
        };

        setUser({
          nickname: userData.nickname ?? '',
          email: userData.email ?? '',
          profileUrl: userData.profileUrl ?? null,
        });
      })
      .catch((err) => {
        console.error('SidebarDrawer getMe 실패:', err);
        // 실패해도 UI는 기본 아바타 + 빈 텍스트로 표시
        setUser({
          nickname: '',
          email: '',
          profileUrl: null,
        });
      });
  }, []);

  //  MyPage에서 브로드캐스트한 프로필 변경 이벤트 수신
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<string | null>;
      const nextProfileUrl = custom.detail ?? null;

      setUser((prev) => ({
        nickname: prev?.nickname ?? '',
        email: prev?.email ?? '',
        profileUrl: nextProfileUrl,
      }));
    };

    window.addEventListener('profile-updated', handler);
    return () => {
      window.removeEventListener('profile-updated', handler);
    };
  }, []);

  return (
    <>
      {/* 드로어 패널 */}
      <aside
        onClick={(e) => e.stopPropagation()}
        className={`fixed top-12 left-0 z-50 h-[calc(100vh-3rem)] w-[200px] bg-white text-[var(--color-jd-black)] shadow-[0_12px_30px_rgba(0,0,0,.25)] ring-1 ring-[var(--color-jd-violet)]/25 transition-transform duration-300 will-change-transform sm:w-[220px] md:w-[240px] ${open ? 'translate-x-0' : '-translate-x-full'} `}
        aria-label="Side controller"
      >
        {/* 로고 + 슬로건 */}
        <div className="flex flex-col items-start gap-1 px-4 pt-4 pb-3">
          {/* 로고 */}
          <img src="/logo/header-logo.png" alt="jobda" className="object-containc h-18 w-auto" />

          {/* 슬로건 */}
          <span className="text-left text-[12px] leading-tight font-medium text-gray-500">
            당신의 채용 여정에 함께하는 AI 코파일럿
          </span>
        </div>

        <div className="h-px bg-[var(--color-jd-gray-light)]" />

        {/* 메뉴 */}
        <nav className="space-y-1 px-3 py-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            {/* 아이콘 */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-gray-dark)]"
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
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-gray-dark)]"
            >
              <path
                d="M14 0H6a3 3 0 0 0-3 3v18a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7.06L14.94 0H14Zm.75 5.25v-3l4.5 4.5h-3a1.5 1.5 0 0 1-1.5-1.5ZM6.75 12.75a.75.75 0 0 1 0-1.5h10.5a.75.75 0 0 1 0 1.5H6.75Zm0 3a.75.75 0 0 1 0-1.5h10.5a.75.75 0 0 1 0 1.5H6.75Zm0 3a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 0 1.5h-6Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm">공고 관리</span>
          </Link>

          <Link
            to="/matches"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-gray-dark)]"
            >
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 5v1h16v-1c0-3-4-5-8-5Z"
                fill="currentColor"
              />
            </svg>
            <span className="text-sm">지원자 조회</span>
          </Link>

          <Link
            to="/interview/manage"
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[var(--color-jd-white)]"
            onClick={onClose}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              className="text-[var(--color-jd-gray-dark)]"
            >
              <path d="M3 4h18v14H6l-3 3V4Z" fill="currentColor" />
            </svg>
            <span className="text-sm">면접 관리</span>
          </Link>
        </nav>

        {/* 하단 사용자 카드 */}
        <div className="absolute right-0 bottom-0 left-0 px-3 py-3">
          <div
            role="button"
            onClick={() => {
              onClose();
              navigate('/mypage');
            }}
            className="flex cursor-pointer items-center justify-between rounded-xl bg-[var(--color-jd-white)] px-3 py-2 ring-1 ring-black/5"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <img
                src={avatarUrl}
                alt="avatar"
                className="aspect-square h-9 w-9 shrink-0 rounded-full object-cover"
              />

              <div className="min-w-0 flex-1 leading-tight">
                <div className="truncate text-sm font-semibold">
                  {user?.nickname || '마이페이지'}
                </div>

                <div className="truncate text-[11px] text-gray-500">
                  {user?.email || '프로필을 확인해 보세요'}
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="로그아웃"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              className="shrink-0 rounded-md p-2 hover:bg-[var(--color-jd-gray-light)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M5 3C3.34315 3 2 4.34315 2 6V18C2 19.6569 3.34315 21 5 21H9C9.55228 21 10 20.5523 10 20C10 19.4477 9.55228 19 9 19H5C4.44772 19 4 18.5523 4 18V6C4 5.44772 4.44772 5 5 5H9C9.55228 5 10 4.55228 10 4C10 3.44772 9.55228 3 9 3H5Z" />
                <path d="M16.2929 7.29289C16.6834 6.90237 17.3166 6.90237 17.7071 7.29289L21.7071 11.2929C22.0976 11.6834 22.0976 12.3166 21.7071 12.7071L17.7071 16.7071C17.3166 17.0976 16.6834 17.0976 16.2929 16.7071C15.9024 16.3166 15.9024 15.6834 16.2929 15.2929L18.5858 13H10C9.44772 13 9 12.5523 9 12C9 11.4477 9.44772 11 10 11H18.5858L16.2929 8.70711C15.9024 8.31658 15.9024 7.68342 16.2929 7.29289Z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
      {/* 로그아웃 확인 모달 */}
      <ConfirmLogoutModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setConfirmOpen(false);
          try {
            // 실제 로그아웃 API + sessionStorage 토큰 삭제
            await logout();
          } catch (error) {
            console.error('로그아웃 API 호출 실패:', error);
          } finally {
            // 재인증 시간 등 추가 상태도 정리
            localStorage.removeItem('reauthAt');

            // 드로어 닫고 로그인 페이지로 이동
            onClose();
            navigate('/login', { replace: true });
          }
        }}
      />
    </>
  );
}
