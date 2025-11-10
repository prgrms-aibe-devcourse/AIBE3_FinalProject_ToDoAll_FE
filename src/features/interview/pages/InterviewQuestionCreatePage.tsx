import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ProfileCard from '../components/question-create/ProfileCard';
import QuestionSection from '../components/question-create/QuestionSection';
import EditButton from '../components/question-create/EditButton';

const initialProfileData = {
  name: '김철수',
  title: '프론트엔드 개발자',
  date: '2025-12-01',
  time: '12:00',
  interviewers: ['홍길동', '홍길순'],
  skills: ['Git', 'React'],
  missingSkills: ['TypeScript', 'Next.js'],
  experiences: [
    '7년 프론트엔드 개발 경험',
    'React와 Next.js 전문가',
    '대규모 전자상거래 플랫폼 개발 경험',
  ],
  image: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
};

const initialQuestionData = [
  {
    title: '기술 및 아키텍처',
    questions: [
      'React에서 렌더링 최적화를 위해 어떤 방법들을 사용해보셨나요?',
      'Next.js의 SSR과 SSG의 차이를 실제 프로젝트에서 어떻게 활용하셨나요?',
      '대규모 전자상거래 플랫폼 개발 시 상태 관리를 어떤 방식으로 구성하셨나요?',
      'React 18의 Concurrent Rendering이나 Suspense for Data Fetching을 사용해보신 경험이 있으신가요?',
      'Next.js에서 Dynamic Routing과 Static Routing을 어떻게 설계하셨나요?',
    ],
  },
  {
    title: '성능 / 품질 / 운영 관련',
    questions: [
      '7년 동안의 프로젝트 경험 중, 성능 이슈 해결 사례를 설명해주세요.',
      '신규 기능 개발 시 코드 품질을 유지하기 위해 어떤 기준을 적용하셨나요?',
      '배포 자동화(CI/CD)나 테스트 자동화를 어떤 방식으로 구성하셨나요?',
    ],
  },
  {
    title: '협업 / 유지보수',
    questions: [
      '성능 개선을 위해 어떤 최적화 전략을 적용하셨나요?',
      'Core Web Vitals(LCP, FID, CLS) 개선을 위해 어떤 모니터링 도구를 사용했는지 설명해주세요.',
    ],
  },
];

export default function InterviewQuestionCreatePage() {
  const location = useLocation();
  const { name, avatar } = location.state || {};

  const [isEditing, setIsEditing] = useState(false);
  const [questionData, setQuestionData] = useState(initialQuestionData);

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  const handleQuestionChange = (sectionIdx: number, questionIdx: number, newValue: string) => {
    const updated = [...questionData];
    updated[sectionIdx].questions[questionIdx] = newValue;
    setQuestionData(updated);
  };

  const handleTitleChange = (sectionIdx: number, newTitle: string) => {
    const updated = [...questionData];
    updated[sectionIdx].title = newTitle;
    setQuestionData(updated);
  };

  const handleAddQuestion = (sectionIdx: number) => {
    const updated = [...questionData];
    updated[sectionIdx].questions.push('');
    setQuestionData(updated);
  };

  const handleAddSection = () => {
    const updated = [...questionData, { title: '', questions: [''] }];
    setQuestionData(updated);
  };

  // 질문 삭제
  const handleDeleteQuestion = (sectionIdx: number, questionIdx: number) => {
    const updated = [...questionData];
    updated[sectionIdx].questions.splice(questionIdx, 1);
    setQuestionData(updated);
  };

  // 주제(섹션) 삭제
  const handleDeleteSection = (sectionIdx: number) => {
    const updated = [...questionData];
    updated.splice(sectionIdx, 1);
    setQuestionData(updated);
  };

  return (
    <div className="mx-auto p-8 min-h-screen bg-[#fbf9f9] font-sans font-semibold">
      <h1 className="text-2xl font-bold mb-6 text-jd-black">질문 노트</h1>

      <div className="flex gap-8">
        <div className="w-1/4">
          <ProfileCard profileData={initialProfileData} name={name} avatar={avatar} />
        </div>

        <div className="w-3/4">
          <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-8 text-sm leading-relaxed">
            {questionData.map((section, idx) => (
              <QuestionSection
                key={idx}
                section={section}
                sectionIdx={idx}
                isEditing={isEditing}
                onQuestionChange={handleQuestionChange}
                onTitleChange={handleTitleChange}
                onAddQuestion={handleAddQuestion}
                onDeleteQuestion={handleDeleteQuestion}
                onDeleteSection={handleDeleteSection}
              />
            ))}

            {/* 주제 추가 버튼 (수정 모드일 때만) */}
            {isEditing && (
              <button
                onClick={handleAddSection}
                className="mt-4 text-[14px] text-jd-violet hover:text-jd-violet-hover transition"
              >
                ＋ 주제 추가
              </button>
            )}
          </div>

          <EditButton isEditing={isEditing} onToggle={handleToggleEdit} />
        </div>
      </div>
    </div>
  );
}
