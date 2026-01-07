import SummarySection from '@features/dashboard/SummarySection.tsx';
import DetailSection from '@features/dashboard/DetailSection.tsx';
import PageTitle from '@components/PageTitile.tsx';

export default function DashBoard() {
  return (
    <PageTitle title="대시보드" description="채용 현황을 한 눈에 확인하세요">
      <section className="mr-auto ml-auto flex w-full flex-col items-center gap-5 sm:w-[640px] md:w-[768px] md:pr-[3rem] md:pl-[3rem] xl:w-[1280px]">
        <SummarySection />
        <DetailSection />
      </section>
    </PageTitle>
  );
}
