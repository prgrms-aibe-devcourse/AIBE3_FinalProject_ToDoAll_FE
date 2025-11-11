import { useEffect } from 'react';
import type { PropsWithChildren, RefObject } from 'react'; // ← 타입은 named import로

type PrivacyModalProps = PropsWithChildren<{
  onClose: () => void; // 모달 닫기 콜백
  title?: string; // 모달 제목
  returnFocusRef?: RefObject<HTMLButtonElement | null>;
}>;

export default function PrivacyModal({
  onClose,
  title = '개인정보 수집‧이용 동의',
  returnFocusRef, // 버튼 ref가 오면 닫힐 때 포커스 복귀
  children,
}: PrivacyModalProps) {
  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 언마운트 시, 트리거 버튼으로 포커스 복귀
  useEffect(() => {
    const prev = returnFocusRef?.current; // cleanup에서 바뀌지 않도록 로컬 변수에 보관
    return () => {
      prev?.focus();
    };
  }, [returnFocusRef]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] grid place-items-center p-4"
    >
      {/* 반투명 배경 */}
      <div
        className="absolute inset-0
        bg-black/4.5
    backdrop-blur-[1.5px]
    backdrop-saturate-125
    transition-all duration-300"
        onClick={onClose}
        aria-hidden
      />

      {/* 모달 카드 */}
      <div className="relative z-[101] w-full max-w-[720px] rounded-2xl bg-white ">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/5">
          <h3 className="text-lg font-semibold text-[#413F3F]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1.5 text-sm font-semibold text-[#413F3F] hover:bg-black/5"
          >
            닫기
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-5">
          <div className="max-h-[360px] overflow-y-auto pr-2 leading-relaxed text-sm text-[#413F3F]">
            <p className="mb-3">
              주식회사 잡다는 &quot;jobda&quot;를 통한 채용 절차 진행을 위하여 귀하의 정보를
              수집합니다. 수집하는 개인정보의 항목은 성명, 전화번호, 이메일주소, 회사명(직책)
              등이며, 개인정보처리의 목적은 채용서비스를 위한 안내, 공지사항 전달, 채용 및 웹사이트
              이용 관련 연락 등의 개인정보처리를 목적으로 합니다.
            </p>
            <p className="mb-3">
              보유기간은 회원탈퇴시까지이며, 정보주체의 요청이 있는 경우 지체없이 파기합니다. 동의
              거부권이 있으나, 동의를 거부할 경우 본 서비스 이용에 제한을 받을 수 있습니다.
            </p>
            {children}
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 border-t border-black/5 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] px-4 py-2 text-sm font-semibold text-white bg-[#752F6D] hover:brightness-110"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
