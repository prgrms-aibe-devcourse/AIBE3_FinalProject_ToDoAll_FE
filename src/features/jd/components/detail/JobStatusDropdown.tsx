import { useState } from 'react';
import type { JobStatus } from '../../types/JobPost.types';

type Props = {
  value: JobStatus;
  onChange?: (_next: JobStatus) => void;
};

export default function JobStatusDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const STATUS_LABEL: Record<JobStatus, string> = {
    DRAFT: '예정',
    OPEN: '진행 중',
    CLOSED: '완료',
  };

  const handleSelect = (_next: JobStatus) => {
    setOpen(false);
    if (_next === value) return;
    onChange?.(_next);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={() => setOpen((prev) => !prev)}
      >
        {STATUS_LABEL[value]}
        <span className="ml-1 text-[10px] text-gray-400">▾</span>
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-1 w-24 rounded-xl border border-gray-200 bg-white py-1 text-xs shadow-lg">
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left hover:bg-gray-100"
            onClick={() => handleSelect('DRAFT')}
          >
            예정
          </button>
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left hover:bg-gray-100"
            onClick={() => handleSelect('OPEN')}
          >
            진행 중
          </button>
          <button
            type="button"
            className="block w-full px-3 py-1.5 text-left hover:bg-gray-100"
            onClick={() => handleSelect('CLOSED')}
          >
            완료
          </button>
        </div>
      )}
    </div>
  );
}
