// src/components/ConfirmLogoutModal.tsx
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

      <div className="relative z-[71] w-[360px] rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,.25)]">
        <h3 className="mb-2 text-lg font-semibold text-[var(--color-jd-black)]">로그아웃</h3>
        <p className="mb-5 text-sm text-[var(--color-jd-gray-dark)]">정말 로그아웃 하시겠어요?</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md bg-[var(--color-jd-gray-light)] px-4 py-2"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-[var(--color-jd-scarlet)] px-4 py-2 text-white"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
