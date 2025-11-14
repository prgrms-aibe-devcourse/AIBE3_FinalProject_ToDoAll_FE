import React, { useState } from 'react';
import { Pill } from '../shared/Pill';

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[12px] font-medium text-gray-600">{label}</div>
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className = '', ...rest } = props;
  return (
    <input
      {...rest}
      className={
        'w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 ' +
        className
      }
    />
  );
}

export function TextArea({
  rows = 4,
  className = '',
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      rows={rows}
      className={
        'w-full rounded-xl border border-gray-200 bg-[#f2eae6] px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 ' +
        className
      }
    />
  );
}

export function TagInput({
  value,
  onChange,
  placeholder,
  label,
  options = [],
}: {
  value: string[];
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  options?: string[];
}) {
  const [draft, setDraft] = useState('');
  const [open, setOpen] = useState(false);

  const normalize = (s: string) => s.trim().toLowerCase();

  const add = (v: string) => {
    const t = v.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
    setDraft('');
  };
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    }
    if (e.key === 'Backspace' && !draft && value.length) {
      remove(value.length - 1);
    }
  };

  const filteredOptions = options
    .filter((opt) => !value.includes(opt))
    .filter((opt) => normalize(opt).includes(normalize(draft)));

  return (
    <div>
      {label ? <div className="mb-1 text-[12px] font-medium text-gray-600">{label}</div> : null}
      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-gray-200 bg-white px-2 py-2">
          <input
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setTimeout(() => setOpen(false), 100);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="flex-1 min-w-[120px] border-none bg-transparent px-2 py-1 text-sm focus:outline-none"
          />
        </div>
        {open && filteredOptions.length > 0 && (
          <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow">
            {filteredOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                className="flex w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
                onMouseDown={(e) => {
                  e.preventDefault();
                  add(opt);
                  setOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-2">
        {value.map((t, i) => (
          <Pill key={t + i} className="bg-white">
            <span className="mr-1">{t}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="-mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label={`${t} 제거`}
            >
              ×
            </button>
          </Pill>
        ))}
      </div>
    </div>
  );
}
