import SummationCard from '@features/dashboard/SummationCard.tsx';
import LongViewSection from '@features/dashboard/LongViewSection.tsx';
import NumberSlotsCard, { type NumberSlotsCardProps } from '@features/dashboard/NumberSlotCard.tsx';
import DateInfoCard, { type DataInfoCardProps } from '@features/dashboard/DateInfoCard.tsx';
import StatusCountCard from '@features/dashboard/StatusCountCard.tsx';
import WeekendSection from '@features/dashboard/WeekendSection.tsx';

const ProgressStatusByJob: NumberSlotsCardProps[] = [
  { title: '시니어 프론트엔드 개발자', slotData: [1, 2, 3, 4], status: 'document' },
  { title: '백엔드 개발자', slotData: [5, 6, 7, 11], status: 'interview' },
  { title: '주니어 풀스택 개발자', slotData: [12, 12, 13, 14], status: 'finished' },
];

const ComingInterview: DataInfoCardProps[] = [
  {
    interviewDate: '11/01',
    applicantName: '김상진',
    jobTitle: '시니어 프론트엔드 개발자',
    interviewTime: '15:00',
    interviewers: '면접관 1, 면접관 2',
  },
  {
    interviewDate: '12/01',
    applicantName: '김상일',
    jobTitle: '시니어 프론트엔드 개발자',
    interviewTime: '14:00',
    interviewers: '면접관 1, 면접관 2',
  },
  {
    interviewDate: '10/11',
    applicantName: '김상이',
    jobTitle: '시니어 프론트엔드 개발자 육성 담당관',
    interviewTime: '10:00',
    interviewers: '면접관 1, 면접관 2',
  },
  {
    interviewDate: '09/11',
    applicantName: '김중진',
    jobTitle: '백엔드 개발자 모집',
    interviewTime: '11:00',
    interviewers: '면접관 1, 면접관 2',
  },
  {
    interviewDate: '02/27',
    applicantName: '김하진',
    jobTitle: '시니어 프론트엔드 개발자',
    interviewTime: '22:00',
    interviewers: '면접관 1, 면접관 2',
  },
];

export default function DashBoard() {
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
              value={'12'}
              detailUrl={'#'}
            />
            <SummationCard
              title={'총 지원자'}
              description={'전체 지원자 수'}
              value={'248'}
              detailUrl={'#'}
            />
            <SummationCard
              title={'예정된 면접'}
              description={'이번 주 면접 일정'}
              value={'20'}
              detailUrl={'#'}
            />
            <SummationCard
              title={'채용 완료'}
              description={'이번 달 채용 완료'}
              value={'8'}
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
              {ProgressStatusByJob.map((item, i) => (
                <NumberSlotsCard key={i} {...item} />
              ))}
            </LongViewSection>

            <LongViewSection
              title={'다가오는 면접'}
              description={'이번 주 예정된 면접 일정'}
              className="jd-LongViewSection-RWD"
              detailUrl={'#'}
            >
              {ComingInterview.map((item, i) => (
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
                <StatusCountCard count={5} dataType={'byJob'} statusType={'in'} />
                <StatusCountCard count={6} dataType={'byJob'} statusType={'before'} />
              </div>
              <StatusCountCard count={11} dataType={'byJob'} statusType={'closed'} />
            </LongViewSection>

            <LongViewSection
              title={'면접 현황'}
              description={'면접의 진행 상태별 현황'}
              className="jd-LongViewSection-RWD"
              detailUrl={'#'}
            >
              <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
                <StatusCountCard count={20} dataType={'byInterview'} statusType={'in'} />
                <StatusCountCard count={2} dataType={'byInterview'} statusType={'before'} />
              </div>
              <StatusCountCard count={7} dataType={'byInterview'} statusType={'closed'} />
            </LongViewSection>
          </section>

          <LongViewSection
            title={'이번 주 캘린더'}
            description={'주간 일정 개요'}
            className="jd-LongViewSection-RWD-full"
            detailUrl={'#'}
          >
            <WeekendSection />
          </LongViewSection>
        </section>
      </section>
    </section>
  );
}
