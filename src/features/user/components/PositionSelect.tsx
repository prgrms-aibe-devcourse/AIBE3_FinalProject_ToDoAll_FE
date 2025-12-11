import type React from 'react';

export type PositionValue = 'OWNER' | 'HR_MANAGER' | 'TEAM_LEAD' | 'INTERVIEWER' | 'OTHER';

interface PositionSelectProps {
  value: PositionValue | '';
  onChange: (_value: PositionValue) => void;
  disabled?: boolean;
  hideLabel?: boolean;
}

const POSITION_OPTIONS: { value: PositionValue; label: string }[] = [
  { value: 'OWNER', label: '대표 / Founder' },
  { value: 'HR_MANAGER', label: '인사/채용 담당자' },
  { value: 'TEAM_LEAD', label: '팀장 / 리더' },
  { value: 'INTERVIEWER', label: '실무 인터뷰어' },
  { value: 'OTHER', label: '기타' },
];

export default function PositionSelect({
  value: _value,
  onChange,
  disabled,
  hideLabel,
}: PositionSelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as PositionValue;

    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1">
      {!hideLabel && <label className="text-m text-jd-black block font-semibold">직책</label>}
      <select
        value={_value}
        onChange={handleChange}
        disabled={disabled}
        className="h-10 w-full rounded-md border bg-white px-3 py-2"
      >
        <option value="" disabled>
          직책을 선택해주세요
        </option>
        {POSITION_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
