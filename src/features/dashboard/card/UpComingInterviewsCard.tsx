import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import useFetch from '@shared/hooks/useFetch.ts';
import DateInfoCardUI, {
  type DataInfoCardProps,
} from '@features/dashboard/card/DateInfoCardUI.tsx';
import { Skeleton } from '@shared/components/Skeleton.tsx';
import BlankCard from '@shared/components/BlankCard.tsx';

export default function UpComingInterviewsCard() {
  const { resData } = useFetch<DataInfoCardProps[]>('/api/v1/dashboard/detail/upcoming-interview');

  return (
    <LongViewContainer
      title={'다가오는 면접'}
      description={'7일 내 예정된 면접 일정'}
      className="jd-LongViewContainer-RWD min-h-[784px]"
      detailUrl={'/interview/manage'}
    >
      {!resData ? (
        new Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="relative h-[118px] rounded-[10px] p-[20px] sm:items-start"
            />
          ))
      ) : resData.length > 0 ? (
        resData.map((item, i) => <DateInfoCardUI key={i} {...item} />)
      ) : (
        <BlankCard text="새로운 면접을 등록해주세요." />
      )}
    </LongViewContainer>
  );
}
