import DetailButton from '@components/dashboard/DetailButton.tsx';
import type { ReactNode } from 'react';
import cn from '@lib/utils/cn.ts';

export default function LongViewSection({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cn(
        'jd-dashboard-section h-fit w-full rounded-[20px] bg-white p-[30px]',
        className
      )}
    >
      <DetailButton className="mb-[15px]" />
      <section className="mb-[15px] flex flex-col">
        <h2 className="text-jd-black font-bold">공고별 합격 현황</h2>
        <p className="text-jd-gray-dark text-sm">각 채용 공고의 진행 상황</p>
      </section>
      <section className="flex flex-col gap-3">{children}</section>
    </section>
  );
}
