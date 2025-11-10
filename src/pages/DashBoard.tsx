import SummationCard from '../features/dashboard/SummationCard.tsx';
import LongViewSection from '../features/dashboard/LongViewSection.tsx';
import NumberSlotsCard from '../features/dashboard/NumberSlotCard.tsx';
import DateInfoCard from '../features/dashboard/DateInfoCard.tsx';
import StatusCountCard from '../features/dashboard/StatusCountCard.tsx';
import WeekendSection from '../features/dashboard/WeekendSection.tsx';

export default function DashBoard() {
  return (
    <section className="bg-jd-white flex justify-center">
      <section className="xl:w-[1280px] md:w-[768px] xs:w-[480px] h-full flex flex-col pl-[58px] pt-[42px] pr-[58px]">
        <h1 className="text-4xl font-bold mb-[5px] w-fit">대시보드</h1>
        <p className="mb-[20px]">채용 현황을 한 눈에 확인하세요</p>
        <section className="flex flex-col gap-5 items-center">
          <section className="flex flex-row w-full gap-4 flex-wrap justify-center">
            <SummationCard />
            <SummationCard />
            <SummationCard />
            <SummationCard />
          </section>

          <section className="flex flex-row w-full gap-4 flex-wrap justify-center">
            <LongViewSection className="max-w-[574px] min-w-[416px]">
              <NumberSlotsCard />
              <NumberSlotsCard />
              <NumberSlotsCard />
            </LongViewSection>

            <LongViewSection className="max-w-[574px] min-w-[416px]">
              <DateInfoCard />
              <DateInfoCard />
              <DateInfoCard />
              <DateInfoCard />
            </LongViewSection>
          </section>

          <section className="flex flex-row w-full gap-4 flex-wrap justify-center">
            <LongViewSection className="max-w-[574px] min-w-[416px]">
              <div className="flex flex-row w-full gap-4 justify-between">
                <StatusCountCard />
                <StatusCountCard />
              </div>
              <StatusCountCard />
            </LongViewSection>

            <LongViewSection className="max-w-[574px] min-w-[416px]">
              <div className="flex flex-row w-full gap-4 justify-between">
                <StatusCountCard />
                <StatusCountCard />
              </div>
              <StatusCountCard />
            </LongViewSection>
          </section>

          <LongViewSection className="min-w-[416px]">
            <WeekendSection />
          </LongViewSection>
        </section>
      </section>
    </section>
  );
}
