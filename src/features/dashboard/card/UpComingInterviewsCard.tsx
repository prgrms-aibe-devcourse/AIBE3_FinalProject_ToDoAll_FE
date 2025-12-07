import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import useFetch from '@/hooks/useFetch.ts';
import DateInfoCardUI, {
  type DataInfoCardProps,
} from '@features/dashboard/card/DateInfoCardUI.tsx';

export default function UpComingInterviewsCard() {
  const { resData } = useFetch<DataInfoCardProps[]>('/api/v1/dashboard/detail/upcoming-interview');

  if (!resData) return <></>;

  return (
    <LongViewContainer
      title={'다가오는 면접'}
      description={'이번 주 예정된 면접 일정'}
      className="jd-LongViewContainer-RWD"
      detailUrl={'/interview/manage'}
    >
      {resData.map((item, i) => (
        <DateInfoCardUI key={i} {...item} />
      ))}
    </LongViewContainer>
  );
}
