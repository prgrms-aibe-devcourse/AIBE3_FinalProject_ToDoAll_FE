import DetailButton from '@components/dashboard/DetailButton.tsx';
import type { ReactNode } from 'react';
import cn from '@lib/utils/cn.ts';

export default function LongViewContainer({
  title,
  description,
  detailUrl,
  className,
  children,
}: {
  title: string;
  description: string;
  detailUrl: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'jd-dashboard-section flex w-full flex-col rounded-[20px] bg-white p-[30px]',
        className
      )}
    >
      <DetailButton className="mb-[15px]" url={detailUrl} />
      <section className="mb-[15px] flex flex-col">
        <h2 className="text-jd-black font-bold">{title}</h2>
        <p className="text-jd-gray-dark text-sm">{description}</p>
      </section>
      <section className="flex h-full flex-col gap-3">{children}</section>
    </section>
  );
}
