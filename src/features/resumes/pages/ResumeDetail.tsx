import type { ResumeData } from '../types/resumes.types';
import ResumeInfo from '../components/ResumeInfo';
import ResumeMemo from '../components/ResumeMemo';
import ApplicantInfo from '../components/ApplicantInfo';
import ApplicantStatus from '../components/ApplicantStatus';

export default function ResumeDetail() {
  const dummyResume: ResumeData = {
    id: '1',
    name: '김잡다',
    gender: '남',
    birth: '1997-04-03',
    profileImage: 'https://via.placeholder.com/150?text=Profile',
    email: 'jobdal@gmail.com',
    phone: '010-1234-5678',
    applyDate: '2025-11-01',
    address: {
      country: '대한민국',
      city: '서울특별시 강남구',
      detail: '강남대로 282',
    },
    education: [
      {
        type: '대학',
        universityType: '일반대',
        name: '잡다 대학교',
        transferred: false,
        major: '컴퓨터공학',
        graduated: true,
        startDate: '2016-03-01',
        endDate: '2020-02-28',
        dayTime: '주간',
        gpa: 3.8,
      },
    ],
    experience: '잡다 주식회사 (2021.01 ~ 현재, 프론트엔드 개발자)',
    activities: '동아리 활동: 웹 개발 동아리',
    certifications: '정보처리기사',
    skills: [
      { name: 'React', level: '고급' },
      { name: 'TypeScript', level: '고급' },
      { name: 'TailwindCSS', level: '중급' },
    ],
    files: {
      resume: '김잡다_자기소개서.pdf',
      portfolio: '김잡다_포트폴리오.pdf',
      etc: ['기타문서1.pdf', '기타문서2.pdf'],
    },
  };

  return (
    <div className="flex h-screen bg-[#FAF8F8]">
      <aside className="w-1/4 p-4">
        <ApplicantStatus data={dummyResume} />
        <ApplicantInfo
          data={{
            email: dummyResume.email,
            phone: dummyResume.phone,
            applyDate: dummyResume.applyDate,
          }}
        />

        <ResumeMemo />
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <ResumeInfo data={dummyResume} />
      </main>
    </div>
  );
}
