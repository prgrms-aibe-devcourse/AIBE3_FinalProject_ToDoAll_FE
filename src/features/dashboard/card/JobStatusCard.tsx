import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import useFetch from '@/hooks/useFetch.ts';
import StatusCountCardUI from '@features/dashboard/card/StatusCountCardUI.tsx';

type NumByProgressStatus = {
  in: number;
  before: number;
  close: number;
};

export default function JobStatusCard() {
  const { resData } = useFetch<NumByProgressStatus>('/api/v1/dashboard/detail/job-status');
  if (!resData) return <></>;

  return (
    <LongViewContainer
      title={'공고 현황'}
      description={'채용 공고의 상태별 현황'}
      className="jd-LongViewContainer-RWD"
      detailUrl={'/jobs'}
    >
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <StatusCountCardUI count={resData.in} dataType={'byJob'} statusType={'in'} />
        <StatusCountCardUI count={resData.before} dataType={'byJob'} statusType={'before'} />
      </div>
      <StatusCountCardUI count={resData.close} dataType={'byJob'} statusType={'closed'} />
    </LongViewContainer>
  );
}
