import DetailButton from '../../components/dashboard/DetailButton.tsx';
import type { ReactNode } from 'react';

export default function LongViewSection({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={'w-full bg-white rounded-[20px] p-[30px] h-fit jd-dashboard-section ' + className}
    >
      <DetailButton className="mb-[15px]" />
      <section className="flex flex-col mb-[15px]">
        <h2 className="font-bold text-jd-black">공고별 합격 현황</h2>
        <p className="text-sm text-jd-gray-dark">각 채용 공고의 진행 상황</p>
      </section>
      <section className="flex flex-col gap-3">{children}</section>
    </section>
  );
}
