import React, { useEffect, useState } from 'react';

type InterviewQuestionAiDto = {
  questionType: string;
  content: string;
};

type UserProfile = {
  name: string;
  role: string;
  careerYears: number;
  stacks: string[];
  interests: string[];
};

const mockFetchUserProfile = async (): Promise<UserProfile> => {
  // 실제로는 API 호출 예정
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        name: '김지원',
        role: '프론트엔드 개발자',
        careerYears: 3,
        stacks: ['React', 'TypeScript', 'Next.js'],
        interests: ['웹 성능', 'UX', '테스트 자동화'],
      });
    }, 400);
  });
};

const mockFetchQuestions = async (): Promise<InterviewQuestionAiDto[]> => {
  // 실제로는 API 호출 예정
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          questionType: 'TECH',
          content: 'React에서 렌더링 최적화를 위해 사용했던 방법들을 설명해 주세요.',
        },
        {
          questionType: 'TECH',
          content:
            'Next.js에서 SSR/ISR을 적용해 본 경험이 있다면, 어떤 기준으로 선택했는지 알려 주세요.',
        },
        {
          questionType: 'CORE',
          content: '협업 과정에서 발생한 갈등을 해결했던 경험이 있다면 말씀해 주세요.',
        },
        {
          questionType: 'OPERATIONS',
          content: '프론트엔드 성능을 측정하거나 모니터링할 때 주로 사용하는 지표와 도구가 있나요?',
        },
      ]);
    }, 800);
  });
};

const InterviewQuestionNotePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestionAiDto[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 질문/유저 정보 동시 로드 (실제 구현 시 Promise.all로 API 호출 예정)
    const load = async () => {
      try {
        const [userRes, questionRes] = await Promise.all([
          mockFetchUserProfile(),
          mockFetchQuestions(),
        ]);
        setUser(userRes);
        setQuestions(questionRes);
      } catch (e) {
        // 실패 시 질문 없음 상태 그대로 두고 로딩만 종료
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const renderQuestions = () => {
    if (isLoading || !questions || questions.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-transparent" />
          <p className="text-sm text-slate-500">질문이 생성중입니다.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {questions.map((q, index) => (
          <div
            key={`${q.questionType}-${index}`}
            className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
          >
            <span className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                  {q.questionType}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-800">{q.content}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <main className="flex flex-1 gap-5 px-5 py-4">
        {/* 왼쪽 프로필 */}
        <aside className="w-72 flex-shrink-0">
          <div className="flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-md">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-300" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  {user ? user.name : '로딩 중'}
                </span>
                <span className="text-xs text-slate-500">
                  {user ? user.role : '사용자 정보를 불러오는 중입니다.'}
                </span>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex">
                <span className="w-16 text-slate-400">경력</span>
                <span className="text-slate-800">{user ? `${user.careerYears}년` : '-'}</span>
              </div>
              <div className="flex">
                <span className="w-16 text-slate-400">기술스택</span>
                <span className="text-slate-800">{user ? user.stacks.join(', ') : '-'}</span>
              </div>
              <div className="flex">
                <span className="w-16 text-slate-400">관심분야</span>
                <span className="text-slate-800">{user ? user.interests.join(', ') : '-'}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 오른쪽 질문 영역 */}
        <section className="flex flex-1">
          <div className="flex flex-1 flex-col rounded-2xl bg-white px-6 py-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-base font-semibold text-slate-900">질문 목록</h1>
            </div>

            <div className="flex-1 overflow-y-auto">{renderQuestions()}</div>

            <div className="mt-4 flex justify-end">
              <button className="inline-flex items-center rounded-full bg-purple-700 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-800">
                질문 수정
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InterviewQuestionNotePage;
