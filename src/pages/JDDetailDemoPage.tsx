import type { JobDetail } from '../features/jd/types/JobDetail.types';
import JobDetailView from '../features/jd/components/detail/JobDetailView';

const demo: JobDetail = {
  id: '1',
  title: '시니어 프론트엔드 개발자',
  location: '서울 강남구',
  applicantsCount: 25,
  status: 'OPEN',
  skills: ['Tailwind CSS', 'Git', 'Next.js', 'TypeScript', 'React'],
  postedAt: '2024-10-15T00:00:00.000Z',
  deadline: '2025-11-15T00:00:00.000Z',
  thumbnailUrl:
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
  description: '자사 서비스 프론트엔드 개발 및 유지보수, UI/UX 개선, 신규 기능 구현 담당',
  preferredSkills: ['Next.js', 'AWS', 'Docker', 'GraphQL'],
  benefits: ['연차휴가', '자율출퇴근', '점심 지원', '교육비 지원', '리프레시 휴가'],
  experience: '5년 이상',
  education: '학력 무관',
  workType: '재택 근무',
  salary: '연봉 4000만 원 ~ 6000만 원',
  department: '개발본부 서비스개발1팀',
};

export default function JDDetailDemoPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">공고 관리</h1>
      </div>
      <JobDetailView
        job={demo}
        onEdit={() => alert('정보 변경')}
        onClose={() => alert('마감 처리')}
      />
    </main>
  );
}
