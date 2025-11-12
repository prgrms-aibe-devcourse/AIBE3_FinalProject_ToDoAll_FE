import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import InterviewSummarySection from '../components/chat/InterviewSummarySection';
import type { QuestionSection, InterviewSummary } from '../types/chatroom';
import ProfileCard from '../components/question-create/ProfileCard';
import QuestionNoteSection from '../components/note/QuestionNoteSection';

export default function InterviewNotePage() {
  const navigate = useNavigate();
  const { state: { name, avatar } = {} } = useLocation();

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

  const questionNotes: QuestionSection[] = [
    {
      topic: '기술 및 아키텍처',
      questions: [
        'React에서 렌더링 최적화를 위해 주로 어떤 방법들을 사용해 보셨나요?',
        '대규모 전역상태 관리를 개선 시, 어떤 결과물로 이어졌나요?',
        'Next.js의 dynamic routing과 static routing의 이해도는?',
        'React 18 이후 도입된 concurrent rendering에 대한 이해도는?',
      ],
    },
    {
      topic: '성능 및 품질 관리',
      questions: [
        '성능 모니터링을 위해 어떤 도구를 사용하셨나요?',
        'CI/CD 환경에서 품질 보장을 위한 전략은 무엇인가요?',
      ],
    },
  ];

  const interviewSummary: InterviewSummary[] = [
    {
      id: 1,
      authorId: 101,
      title: '김영희 면접관',
      content:
        'React의 렌더링 메커니즘을 잘 이해하고 있으며 memo/useMemo/useCallback을 적절히 사용함.',
    },
    {
      id: 2,
      authorId: 102,
      title: '박영희 면접관 (나)',
      content: '답변이 명확하고 실무 경험이 반영되어 있음. 성능 모니터링 도구 활용 경험 확인 필요.',
    },
    {
      id: 3,
      authorId: 103,
      title: '김민식 면접관',
      content:
        '전체적으로 React 렌더링 최적화에 대한 깊은 이해를 가지고 있으며 실무 적용 경험이 충분함.',
    },
  ];

  return (
    <div className="bg-jd-white text-jd-black flex h-screen flex-col overflow-hidden">
      {/* 헤더 */}
      <header className="flex shrink-0 items-center justify-between px-10 pt-6">
        <h1 className="text-jd-black text-2xl font-bold">면접 노트</h1>
        <button
          onClick={() => navigate('/interview/manage')}
          className="text-jd-gray-dark hover:text-jd-black text-sm transition"
        >
          ← 돌아가기
        </button>
      </header>

      {/* 본문 */}
      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* 왼쪽: 지원자 정보 */}
        <div className="w-1/4">
          <ProfileCard profileData={initialProfileData} name={name} avatar={avatar} />
        </div>

        {/* 가운데: 질문 목록 */}
        <QuestionNoteSection questionNotes={questionNotes} />

        {/* 오른쪽: 면접관 평가 */}
        <InterviewSummarySection summaries={interviewSummary} currentUserId={102} />
      </div>
    </div>
  );
}
