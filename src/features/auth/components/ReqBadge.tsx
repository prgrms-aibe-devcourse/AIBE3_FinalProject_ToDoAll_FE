export default function ReqBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border border-transparent !px-2.5 !py-1.5 text-[11.5px] leading-[1.1] font-medium ${ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'} shadow-sm`}
    >
      {ok ? '✓' : '✕'}&nbsp;{label}
    </span>
  );
}
