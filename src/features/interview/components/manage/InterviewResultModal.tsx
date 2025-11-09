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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="relative bg-[#E3DBDB] rounded-2xl p-8 w-[90%] max-w-[600px] h-[300px] text-center shadow-xl flex flex-col items-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        {avatar && (
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full object-cover mt-2 mb-5 border-4 border-white shadow-md"
          />
        )}

        <p className="font-medium text-gray-800 mb-8 text-lg">
          {name ? `${name} 님의 면접 결과를 등록합니다` : '면접 결과를 등록합니다'}
        </p>

        <div className="flex justify-center gap-6">
          {['합격', '보류', '불합격'].map((label) => (
            <button
              key={label}
              className="bg-white px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
