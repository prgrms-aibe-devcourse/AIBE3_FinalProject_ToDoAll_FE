import SummationCardUI from '@features/dashboard/card/SummationCardUI.tsx';

const summaryCards = [
  {
    title: '활성 공고',
    description: '모집 중인 채용 공고',
    detailUrl: '/jobs',
    fetchUrl: '/api/v1/dashboard/summary/actives',
    iconName: 'book-text',
  },
  {
    title: '총 지원자',
    description: '모집 중인 공고의 전체 지원자',
    detailUrl: '/matches',
    fetchUrl: '/api/v1/dashboard/summary/applicants',
    iconName: 'users',
  },
  {
    title: '예정된 면접',
    description: '7일 내 다가오는 면접',
    detailUrl: '/interview/manage',
    fetchUrl: '/api/v1/dashboard/summary/interviews',
    iconName: 'calendar',
  },
  {
    title: '채용 완료',
    description: '이번 달 합격자',
    detailUrl: '/interview/manage',
    fetchUrl: '/api/v1/dashboard/summary/hires',
    iconName: 'user-check',
  },
];

export default function SummarySection() {
  return (
    <section className="flex w-full flex-row flex-wrap justify-center gap-4 xl:justify-between">
      {summaryCards.map((summary, index) => (
        <SummationCardUI key={index} {...summary} />
      ))}
    </section>
  );
}
