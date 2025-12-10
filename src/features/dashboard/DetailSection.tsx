import DetailRow from '@features/dashboard/DetailRow.tsx';
import ApplicantsStatCard from '@features/dashboard/card/ApplicantsStatCard.tsx';
import UpComingInterviewsCard from '@features/dashboard/card/UpComingInterviewsCard.tsx';
import JobStatusCard from '@features/dashboard/card/JobStatusCard.tsx';
import InterviewStatusCard from '@features/dashboard/card/InterviewStatusCard.tsx';
import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import WeekendContainer from '@features/dashboard/container/WeekendContainer.tsx';

export default function DetailSection() {
  return (
    <>
      <DetailRow>
        <ApplicantsStatCard />
        <UpComingInterviewsCard />
      </DetailRow>
      <DetailRow>
        <JobStatusCard />
        <InterviewStatusCard />
      </DetailRow>
      <LongViewContainer
        title={'이번 주 캘린더'}
        description={'주간 일정 개요'}
        className="jd-LongViewContainerCard-RWD-full"
        detailUrl={'#'}
      >
        <WeekendContainer />
      </LongViewContainer>
    </>
  );
}
