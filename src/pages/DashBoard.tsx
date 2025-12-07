import SummarySection from '@features/dashboard/SummarySection.tsx';
import DetailSection from '@features/dashboard/DetailSection.tsx';

export default function DashBoard() {
  //TODO : 로딩 프로그레스나 스켈레톤 처리

  return (
    <section className="bg-jd-white flex justify-center pb-20">
      <section className="flex h-full w-[337px] flex-col p-[1rem] pt-[2rem] sm:w-[640px] md:w-[768px] md:pr-[3rem] md:pl-[3rem] xl:w-[1280px]">
        <h1 className="mb-[5px] w-fit text-4xl font-bold">대시보드</h1>
        <p className="mb-[20px]">채용 현황을 한 눈에 확인하세요</p>
        <section className="flex flex-col items-center gap-5">
          <SummarySection />
          <DetailSection />
        </section>
      </section>
    </section>
  );
}
