import { useEffect, useRef } from 'react';
let baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

interface InterviewResultModalProps {
  name?: string;
  avatar?: string;
  interviewId?: number; // 인터뷰 ID 전달 필요!
  onClose: () => void;
  onSuccess?: (_result: 'PASS' | 'HOLD' | 'FAIL') => void; // 상태 갱신용 콜백(optional)
}

export default function InterviewResultModal({
  name,
  avatar,
  interviewId,
  onClose,
  onSuccess,
}: InterviewResultModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleResultUpdate = async (result: 'PASS' | 'HOLD' | 'FAIL') => {
    if (!interviewId) return;

    try {
      const response = await fetch(`${baseUrl}/api/v1/interviews/${interviewId}/result`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });

      if (!response.ok) throw new Error('Result update failed');

      alert('결과가 등록되었습니다.');
      onSuccess?.(result); // 부모에서 UI 업데이트 필요할 때
      onClose();
    } catch (error) {
      console.error(error);
      alert('결과 등록에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        className="relative flex h-[300px] w-[90%] max-w-[600px] flex-col items-center rounded-2xl bg-[#E3DBDB] p-8 text-center shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="mt-2 mb-5 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
          />
        )}

        <p className="mb-8 text-lg font-medium text-gray-800">
          {name ? `${name} 님의 면접 결과를 등록합니다` : '면접 결과를 등록합니다'}
        </p>

        <div className="flex justify-center gap-6">
          <button
            className="rounded-lg bg-white px-8 py-3 font-semibold hover:bg-gray-50"
            onClick={() => handleResultUpdate('PASS')}
          >
            합격
          </button>

          <button
            className="rounded-lg bg-white px-8 py-3 font-semibold hover:bg-gray-50"
            onClick={() => handleResultUpdate('HOLD')}
          >
            보류
          </button>

          <button
            className="rounded-lg bg-white px-8 py-3 font-semibold hover:bg-gray-50"
            onClick={() => handleResultUpdate('FAIL')}
          >
            불합격
          </button>
        </div>
      </div>
    </div>
  );
}
