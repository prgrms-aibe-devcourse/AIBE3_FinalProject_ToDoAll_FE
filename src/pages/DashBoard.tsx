import SummationCard from '@features/dashboard/SummationCard.tsx';
import LongViewSection from '@features/dashboard/LongViewSection.tsx';
import NumberSlotsCard, { type NumberSlotsCardProps } from '@features/dashboard/NumberSlotCard.tsx';
import DateInfoCard, { type DataInfoCardProps } from '@features/dashboard/DateInfoCard.tsx';
import StatusCountCard from '@features/dashboard/StatusCountCard.tsx';
import WeekendSection, { type WeeklyCalendarType } from '@features/dashboard/WeekendSection.tsx';

import useFetch from '@/hooks/useFetch.ts';

type NumByProgressStatus = {
  in: number;
  before: number;
  close: number;
};

// TODO : 리렌더링 최적화 (요청 별 컴포넌트 분리)
export default function DashBoard() {
  const { resData: summaryActive } = useFetch<number>('api/v1/dashboard/summary/active');
  const { resData: summaryApplicant } = useFetch<number>('api/v1/dashboard/summary/applicant');
  const { resData: summaryInterview } = useFetch<number>('api/v1/dashboard/summary/interview');
  const { resData: summaryHired } = useFetch<number>('api/v1/dashboard/summary/hired');

  const { resData: jobResults } = useFetch<NumberSlotsCardProps[]>(
    'api/v1/dashboard/detail/job-result'
  );
  const { resData: upcomingInterviews } = useFetch<DataInfoCardProps[]>(
    'api/v1/dashboard/detail/upcoming-interview'
  );

  const { resData: jobStatus } = useFetch<NumByProgressStatus>(
    'api/v1/dashboard/detail/job-status'
  );
  const { resData: interviewStatus } = useFetch<NumByProgressStatus>(
    'api/v1/dashboard/detail/interview-status'
  );

  const { resData: weeklyCalendar } = useFetch<WeeklyCalendarType>(
    'api/v1/dashboard/week-calendar'
  );

  //TODO : 로딩 프로그레스나 스켈레톤 처리
  if (
    !summaryActive ||
    !summaryApplicant ||
    !summaryInterview ||
    !summaryHired ||
    !jobResults ||
    !upcomingInterviews ||
    !jobStatus ||
    !interviewStatus ||
    !weeklyCalendar
  )
    return <div></div>;

  return (
    <section className="bg-jd-white flex justify-center">
      <section className="flex h-full w-[337px] flex-col p-[1rem] pt-[2rem] sm:w-[640px] md:w-[768px] md:pr-[3rem] md:pl-[3rem] xl:w-[1280px]">
        <h1 className="mb-[5px] w-fit text-4xl font-bold">대시보드</h1>
        <p className="mb-[20px]">채용 현황을 한 눈에 확인하세요</p>
        <section className="flex flex-col items-center gap-5">
          <section className="flex w-full flex-row flex-wrap justify-center gap-4 xl:justify-between">
            <SummationCard
              title={'활성 공고'}
              description={'진행 중인 채용 공고'}
              value={summaryActive}
              detailUrl={'#'}
            />
            <SummationCard
              title={'총 지원자'}
              description={'전체 지원자 수'}
              value={summaryApplicant}
              detailUrl={'#'}
            />
            <SummationCard
              title={'예정된 면접'}
              description={'이번 주 면접 일정'}
              value={summaryInterview}
              detailUrl={'#'}
            />
            <SummationCard
              title={'채용 완료'}
              description={'이번 달 채용 완료'}
              value={summaryHired}
              detailUrl={'#'}
            />
          </section>

          <section className="flex w-full flex-row flex-wrap justify-center gap-4">
            <LongViewSection
              title={'공고별 합격 현황'}
              description={'각 채용공고의 진행 현황'}
              className="jd-LongViewSection-RWD"
              detailUrl={'#'}
            >
              {jobResults.map((item, i) => (
                <NumberSlotsCard key={i} {...item} />
              ))}
            </LongViewSection>

            <LongViewSection
              title={'다가오는 면접'}
              description={'이번 주 예정된 면접 일정'}
              className="jd-LongViewSection-RWD"
              detailUrl={'#'}
            >
              {upcomingInterviews.map((item, i) => (
                <DateInfoCard key={i} {...item} />
              ))}
            </LongViewSection>
          </section>

          <section className="flex w-full flex-row flex-wrap justify-center gap-4">
            <LongViewSection
              title={'공고 현황'}
              description={'채용 공고의 상태별 현황'}
              className="jd-LongViewSection-RWD"
              detailUrl={'#'}
            >
              <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                <StatusCountCard count={jobStatus.in} dataType={'byJob'} statusType={'in'} />
                <StatusCountCard
                  count={jobStatus.before}
                  dataType={'byJob'}
                  statusType={'before'}
                />
              </div>
              <StatusCountCard count={jobStatus.close} dataType={'byJob'} statusType={'closed'} />
            </LongViewSection>

            <LongViewSection
              title={'면접 현황'}
              description={'면접의 진행 상태별 현황'}
              className="jd-LongViewSection-RWD"
              detailUrl={'#'}
            >
              <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                <StatusCountCard
                  count={interviewStatus.in}
                  dataType={'byInterview'}
                  statusType={'in'}
                />
                <StatusCountCard
                  count={interviewStatus.before}
                  dataType={'byInterview'}
                  statusType={'before'}
                />
              </div>
              <StatusCountCard
                count={interviewStatus.close}
                dataType={'byInterview'}
                statusType={'closed'}
              />
            </LongViewSection>
          </section>

          <LongViewSection
            title={'이번 주 캘린더'}
            description={'주간 일정 개요'}
            className="jd-LongViewSection-RWD-full"
            detailUrl={'#'}
          >
            <WeekendSection calendarData={weeklyCalendar} />
          </LongViewSection>
        </section>
      </section>
    </section>
  );
}
