import type { ModalPropsType } from '@shared/store/useAlertStore.ts';

export default function AlertModal({
  open,
  type = 'info',
  title,
  message,
  onClose,
  confirmText = '확인',
  onConfirm,
}: ModalPropsType) {
  if (!open) return null;

  const colors = {
    success: 'bg-[var(--color-jd-yellow)]',
    error: 'bg-[var(--color-jd-yellow)]',
    info: 'bg-[var(--color-jd-yellow)]',
    warning: 'bg-[var(--color-jd-scarlet)]',
  };

  const defaultTitles = {
    success: '성공',
    error: '오류',
    info: '알림',
    warning: '경고',
  };

  const buttonColor = colors[type];
  const displayTitle = title || defaultTitles[type];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-transparent" onClick={onClose} />

      <div className="relative z-[71] w-[360px] rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,.25)]">
        <h3 className="mb-2 text-lg font-semibold text-[var(--color-jd-black)]">{displayTitle}</h3>

        <p className="mb-5 text-sm whitespace-pre-line text-[var(--color-jd-gray-dark)]">
          {message}
        </p>

        <div className="flex justify-end gap-2">
          {onConfirm ? (
            <>
              <button
                onClick={onClose}
                className="rounded-md bg-[var(--color-jd-gray-light)] px-4 py-2 text-sm text-[var(--color-jd-black)]"
              >
                취소
              </button>
              <button
                onClick={onConfirm}
                className={`rounded-md px-4 py-2 text-sm text-white ${buttonColor}`}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`rounded-md px-4 py-2 text-sm text-white ${buttonColor}`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
