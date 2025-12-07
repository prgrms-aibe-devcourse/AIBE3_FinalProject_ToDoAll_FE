import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import NumberSlotsCard, {
  type NumberSlotsCardProps,
} from '@features/dashboard/card/NumberSlotCardUI.tsx';
import useFetch from '@/hooks/useFetch.ts';

export default function ApplicantsStatCard() {
  const { resData } = useFetch<NumberSlotsCardProps[]>(
    '/api/v1/dashboard/detail/applicant-stat-byJob'
  );

  if (!resData) return <></>;

  return (
    <LongViewContainer
      title={'공고별 합격 현황'}
      description={'각 채용공고의 진행 현황'}
      className="jd-LongViewContainer-RWD"
      detailUrl={'/jobs'}
    >
      {resData.map((item, i) => (
        <NumberSlotsCard key={i} {...item} />
      ))}
    </LongViewContainer>
  );
}
