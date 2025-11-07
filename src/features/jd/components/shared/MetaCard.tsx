import React from 'react';
export function MetaCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 p-4">
      <div className="text-[11px] font-medium text-gray-500 mb-1">{label}</div>
      <div className="text-sm text-gray-900 leading-relaxed">{children}</div>
    </div>
  );
}
