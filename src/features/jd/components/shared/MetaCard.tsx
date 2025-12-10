import React from 'react';
export function MetaCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
      <div className="mb-1 text-[11px] font-medium text-gray-500">{label}</div>
      <div className="text-sm leading-relaxed text-gray-900">{children}</div>
    </div>
  );
}
