import React, { useState } from 'react';
import { Check } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isMine: boolean;
}

interface QuestionSection {
  topic: string;
  questions: string[];
}

interface InterviewSummary {
  title: string;
  content: string;
}

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
      'React의 렌더링 메커니즘을 잘 이해하고 있으며, memo, useMemo, useCallback을 적절히 사용함.',
  },
  {
    title: '박영희 면접관 (나)',
    content:
      '답변이 명확하고 실무 경험이 반영되어 있음. 추가적으로 성능 모니터링 도구 활용 경험 확인 필요.',
  },
  {
    title: '김민식 면접관',
    content:
      '전체적으로 React 렌더링 최적화에 대한 깊은 이해를 가지고 있으며, 실무 적용 경험이 충분함.',
  },
];

export default function InterviewChatRoomPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  // ✅ 체크 상태 관리 (질문별)
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    setMessages([...messages, { id: Date.now(), text: newMessage, isMine: true }]);
    setNewMessage('');
  };

  const toggleCheck = (question: string) => {
    const newSet = new Set(checkedQuestions);
    if (newSet.has(question)) newSet.delete(question);
    else newSet.add(question);
    setCheckedQuestions(newSet);
  };

  return (
    <div className="flex flex-col h-screen bg-jd-white text-jd-black">
      {/* 헤더 */}
      <header className="flex justify-between items-center px-10 py-6 h-20">
        <h1 className="text-3xl font-semibold text-jd-black">면접</h1>
        <button className="bg-jd-yellow text-white px-6 py-2 rounded-lg hover:bg-jd-yellow-hover transition text-m font-semibold">
          면접 종료
        </button>
      </header>

      {/* 본문 (3열 레이아웃) */}
      <div className="flex flex-1 gap-6 px-8 pb-8">
        {/* 왼쪽: 채팅창 */}
        <div className="flex flex-col w-[40%] bg-white border border-jd-gray-light rounded-2xl shadow-md p-6">
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
                {!m.isMine && (
                  <img
                    src="https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg"
                    alt="상대방 프로필"
                    className="w-8 h-8 rounded-full border mr-3 border-jd-gray-light"
                  />
                )}
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                    m.isMine
                      ? 'bg-jd-gray-light text-jd-black shadow'
                      : 'bg-white border border-jd-gray-light text-jd-black shadow'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* 입력창 */}
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-jd-gray-light rounded-full px-4 py-1.5 w-full bg-white shadow-sm">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-transparent text-sm focus:outline-none text-jd-black placeholder-jd-gray-black"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button
                onClick={handleSend}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition"
              >
                {/* 위쪽 화살표 아이콘 */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="gray"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 19V5m0 0l-7 7m7-7l7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 가운데: 질문 노트 */}
        <div className="w-[35%] bg-white border border-jd-gray-light rounded-2xl shadow-md p-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-jd-gray-dark">질문 노트</h2>

          {questionNotes.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className="font-semibold mb-2 text-jd-gray-dark">{section.topic}</h3>
              <ul className="space-y-2">
                {section.questions.map((q, i) => (
                  <li
                    key={i}
                    className={`flex items-center justify-between bg-jd-white rounded-xl p-3 text-sm`}
                  >
                    <span className="text-jd-black">{q}</span>
                    <button
                      onClick={() => toggleCheck(q)}
                      className={`w-6 h-6 flex items-center justify-center rounded-full transition ${
                        checkedQuestions.has(q)
                          ? 'bg-[#DE4F36] text-white'
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      }`}
                    >
                      <Check size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 오른쪽: 면접관 평가 */}
        <div className="w-[25%] rounded-2xl flex flex-col">
          {interviewSummary.map((item, idx) => (
            <div key={idx} className="bg-jd-gray-light rounded-xl p-4 shadow-sm mb-2">
              <h3 className="text-sm font-semibold mb-1 text-jd-violet">{item.title}</h3>
              <p className="text-sm leading-relaxed text-jd-black">{item.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
