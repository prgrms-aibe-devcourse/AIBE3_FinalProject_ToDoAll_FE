import cn from '@lib/utils/cn.ts';

export default function ApplicantCount({
  count,
  className = '',
}: {
  count: number;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 text-gray-400"
        fill="currentColor"
      >
        <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.418 0-8 2.91-8 6.5V23h16v-2.5C20 16.91 16.418 14 12 14z" />
      </svg>
      <div className="leading-tight">
        <div className="text-[11px] text-gray-500">지원자 수</div>
        <div className="text-lg font-semibold text-orange-500">{count}명</div>
      </div>
    </div>
  );
}
