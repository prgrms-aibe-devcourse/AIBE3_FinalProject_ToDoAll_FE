import DetailRow from '@features/dashboard/DetailRow.tsx';
import ApplicantsStatCard from '@features/dashboard/card/ApplicantsStatCard.tsx';
import UpComingInterviewsCard from '@features/dashboard/card/UpComingInterviewsCard.tsx';
import JobStatusCard from '@features/dashboard/card/JobStatusCard.tsx';
import InterviewStatusCard from '@features/dashboard/card/InterviewStatusCard.tsx';

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
    </>
  );
}
