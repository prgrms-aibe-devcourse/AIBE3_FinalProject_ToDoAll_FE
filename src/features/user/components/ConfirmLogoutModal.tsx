// src/components/ConfirmLogoutModal.tsx
import { logout } from '../../auth/api/auth.api.ts';

type Props = {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmLogoutModal({ open, onConfirm, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* 살짝만 어둡게 + 클릭 통과 막지 않음 → 배경 사용 원하면 아래 div 완전히 제거해도 됨 */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative bg-white rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,.25)] w-[360px] p-6 z-[71]">
        <h3 className="text-lg font-semibold mb-2 text-[var(--color-jd-black)]">로그아웃</h3>
        <p className="text-sm text-[var(--color-jd-gray-dark)] mb-5">정말 로그아웃 하시겠어요?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[var(--color-jd-gray-light)]"
          >
            취소
          </button>
          <button
            onClick={async () => {
              try {
                await logout(); // 서버 세션 종료 및 refreshToken 쿠키 제거
              } finally {
                onConfirm(); // 부모 컴포넌트로 알림 (ex: 화면 전환, 모달 닫기)
              }
            }}
            className="px-4 py-2 rounded-md bg-[var(--color-jd-scarlet)] text-white"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
