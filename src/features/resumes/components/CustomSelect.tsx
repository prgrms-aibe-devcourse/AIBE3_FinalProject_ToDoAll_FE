import { useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type Props = {
  value?: string;
  onChange: (_value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
};

export default function CustomSelect({
  value: _value,
  onChange,
  options,
  placeholder = '선택하세요',
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);

  const selected = options.find((opt) => opt.value === _value);

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl border border-[#413F3F] px-4 py-2 text-left"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-[#413F3F]">{selected ? selected.label : placeholder}</span>

        <span className="text-[10px] text-[#413F3F]">▼</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-10 mt-1 w-full rounded-xl border border-gray-300 bg-white shadow-md">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`block w-full px-4 py-2 text-left transition ${
                opt.value === _value
                  ? 'rounded-xl bg-[#D8C7D7] font-medium text-gray-900'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
