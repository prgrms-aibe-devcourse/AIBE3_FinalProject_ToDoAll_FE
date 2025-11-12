import SummationCard from '../features/dashboard/SummationCard.tsx';
import LongViewSection from '../features/dashboard/LongViewSection.tsx';
import NumberSlotsCard from '../features/dashboard/NumberSlotCard.tsx';
import DateInfoCard from '../features/dashboard/DateInfoCard.tsx';
import StatusCountCard from '../features/dashboard/StatusCountCard.tsx';
import WeekendSection from '../features/dashboard/WeekendSection.tsx';

export default function DashBoard() {
  return (
    <section className="bg-jd-white flex justify-center">
      <section className="flex h-full w-[337px] flex-col p-[1rem] pt-[2rem] sm:w-[640px] md:w-[768px] md:pr-[3rem] md:pl-[3rem] xl:w-[1280px]">
        <h1 className="mb-[5px] w-fit text-4xl font-bold">대시보드</h1>
        <p className="mb-[20px]">채용 현황을 한 눈에 확인하세요</p>
        <section className="flex flex-col items-center gap-5">
          <section className="flex w-full flex-row flex-wrap justify-center gap-4 xl:justify-between">
            <SummationCard />
            <SummationCard />
            <SummationCard />
            <SummationCard />
          </section>

          <section className="flex w-full flex-row flex-wrap justify-center gap-4">
            <LongViewSection className="jd-LongViewSection-RWD">
              <NumberSlotsCard />
              <NumberSlotsCard />
              <NumberSlotsCard />
            </LongViewSection>

            <LongViewSection className="jd-LongViewSection-RWD">
              <DateInfoCard />
              <DateInfoCard />
              <DateInfoCard />
              <DateInfoCard />
            </LongViewSection>
          </section>

          <section className="flex w-full flex-row flex-wrap justify-center gap-4">
            <LongViewSection className="jd-LongViewSection-RWD">
              <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                <StatusCountCard />
                <StatusCountCard />
              </div>
              <StatusCountCard />
            </LongViewSection>

            <LongViewSection className="jd-LongViewSection-RWD">
              <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                <StatusCountCard />
                <StatusCountCard />
              </div>
              <StatusCountCard />
            </LongViewSection>
          </section>

          <LongViewSection className="jd-LongViewSection-RWD-full">
            <WeekendSection />
          </LongViewSection>
        </section>
      </section>
    </section>
  );
}
