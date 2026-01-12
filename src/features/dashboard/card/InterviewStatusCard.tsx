import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import useFetch from '@shared/hooks/useFetch.ts';
import StatusCountCardUI from '@features/dashboard/card/StatusCountCardUI.tsx';

type NumByProgressStatus = {
  in: number;
  before: number;
  close: number;
};

export default function InterviewStatusCard() {
  const { resData } = useFetch<NumByProgressStatus>('/api/v1/dashboard/detail/interview-status');

  return (
    <LongViewContainer
      title={'면접 현황'}
      description={'면접의 진행 상태별 현황'}
      className="jd-LongViewContainer-RWD"
      detailUrl={'/interview/manage'}
    >
      <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
        <StatusCountCardUI
          count={resData ? resData.in : null}
          dataType={'byInterview'}
          statusType={'in'}
        />
        <StatusCountCardUI
          count={resData ? resData.before : null}
          dataType={'byInterview'}
          statusType={'before'}
        />
      </div>
      <StatusCountCardUI
        count={resData ? resData.close : null}
        dataType={'byInterview'}
        statusType={'closed'}
      />
    </LongViewContainer>
  );
}
