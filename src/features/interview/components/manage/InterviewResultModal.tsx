import { useEffect, useRef } from 'react';

interface InterviewResultModalProps {
  name?: string;
  avatar?: string;
  onClose: () => void;
}

export default function InterviewResultModal({ name, avatar, onClose }: InterviewResultModalProps) {
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
          {['합격', '보류', '불합격'].map((label) => (
            <button
              key={label}
              className="rounded-lg bg-white px-8 py-3 font-semibold hover:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
