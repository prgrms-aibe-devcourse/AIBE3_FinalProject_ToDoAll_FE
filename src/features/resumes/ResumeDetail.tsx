// src/features/resumes/pages/ResumeDetail.tsx
import ResumeInfo from './components/ResumeInfo';
import ResumeMemo from './components/Resumememo';
import ApplicantInfo from './components/ApplicantInfo';

export default function ResumeDetail() {
  const dummyResume = {
    id: '1',
    name: '김잡다',
    email: 'jobdal@gmail.com',
    phone: '010-1234-5678',
    applyDate: '2025.11.01',
    birth: '1997.04.03',
    address: '대한민국 서울특별시 강남구 강남대로 282',
    profileImage: 'https://via.placeholder.com/150?text=Profile',
    education: '잡다 대학교 (2016.03 ~ 2020.02)',
    experience: '잡다 주식회사 (2021.01 ~ 현재, 프론트엔드 개발자)',
    skills: ['React', 'TypeScript', 'TailwindCSS'],
    files: {
      resume: '김잡다_자기소개서.pdf',
      portfolio: '김잡다_포트폴리오.pdf',
    },
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-1/4 border-r bg-white p-4">
        <ApplicantInfo />
        <ResumeMemo />
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <ResumeInfo data={dummyResume} />
      </main>
    </div>
  );
}
