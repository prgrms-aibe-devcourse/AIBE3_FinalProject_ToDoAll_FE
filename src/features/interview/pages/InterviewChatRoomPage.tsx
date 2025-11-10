import { useLocation, useNavigate } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import QuestionNoteSection from '../components/chat/QuestionNoteSection';
import InterviewSummarySection from '../components/chat/InterviewSummarySection';
import type { Message, QuestionSection, InterviewSummary } from '../types/chatroom';

const initialMessages: Message[] = [
  { id: 1, text: '안녕하세요, 김철수입니다.', isMine: false },
  {
    id: 2,
    text: 'React에서 렌더링 최적화를 위해 주로 어떤 방법들을 사용해 보셨나요?',
    isMine: true,
  },
];

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
    title: '김영희 면접관',
    content:
      'React의 렌더링 메커니즘을 잘 이해하고 있으며 memo/useMemo/useCallback을 적절히 사용함.',
  },
  {
    title: '박영희 면접관 (나)',
    content: '답변이 명확하고 실무 경험이 반영되어 있음. 성능 모니터링 도구 활용 경험 확인 필요.',
  },
  {
    title: '김민식 면접관',
    content:
      '전체적으로 React 렌더링 최적화에 대한 깊은 이해를 가지고 있으며 실무 적용 경험이 충분함.',
  },
];

export default function InterviewChatRoomPage() {
  const location = useLocation();
  const { avatar } = location.state || {};
  const navigate = useNavigate();

  const handleEndInterview = () => {
    navigate('/interview/manage');
  };

  return (
    <div className="flex flex-col h-screen bg-jd-white text-jd-black overflow-hidden">
      {/* 헤더 */}
      <header className="flex justify-between items-center px-10 py-6 h-20 shrink-0">
        <h1 className="text-3xl font-semibold text-jd-black">면접</h1>
        <button
          onClick={handleEndInterview}
          className="bg-jd-yellow text-white px-6 py-2 rounded-lg hover:bg-jd-yellow-hover transition text-m font-semibold"
        >
          면접 종료
        </button>
      </header>

      {/* 본문 (3열 레이아웃) */}
      <div className="flex flex-1 gap-6 px-8 pb-8 overflow-hidden">
        <div className="flex flex-1 gap-6 h-full overflow-hidden">
          <ChatSection initialMessages={initialMessages} avatar={avatar} />
          <QuestionNoteSection questionNotes={questionNotes} />
          <InterviewSummarySection summaries={interviewSummary} />
        </div>
      </div>
    </div>
  );
}
