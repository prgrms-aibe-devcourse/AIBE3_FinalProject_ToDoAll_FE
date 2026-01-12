import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import NumberSlotsCard, {
  type NumberSlotsCardProps,
} from '@features/dashboard/card/NumberSlotCardUI.tsx';
import useFetch from '@shared/hooks/useFetch.ts';
import { Skeleton } from '@shared/components/Skeleton.tsx';
import BlankCard from '@shared/components/BlankCard.tsx';

export default function ApplicantsStatCard() {
  const { resData } = useFetch<NumberSlotsCardProps[]>(
    '/api/v1/dashboard/detail/applicant-stat-byJob'
  );

  return (
    <LongViewContainer
      title={'공고별 합격 현황'}
      description={'각 채용 공고 별 지원자 현황'}
      className="jd-LongViewContainer-RWD min-h-[784px]"
      detailUrl={'/jobs'}
    >
      {!resData ? (
        <>
          <Skeleton className="relative h-[190px] rounded-[10px] p-[20px] sm:items-start" />
          <Skeleton className="relative h-[190px] rounded-[10px] p-[20px] sm:items-start" />
          <Skeleton className="relative h-[190px] rounded-[10px] p-[20px] sm:items-start" />
        </>
      ) : resData.length > 0 ? (
        resData.map((item, i) => <NumberSlotsCard key={i} {...item} />)
      ) : (
        <BlankCard text="새로운 공고를 등록해주세요." />
      )}
    </LongViewContainer>
  );
}
