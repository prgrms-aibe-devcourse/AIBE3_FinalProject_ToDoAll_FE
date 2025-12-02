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

// 실제 API 대신 사용하는 더미 fetch 함수들
const mockFetchUserProfile = async (): Promise<UserProfile> => {
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
          questionType: 'BEHAVIOR',
          content: '본인이 가장 크게 성장을 느꼈던 경험과 그 계기를 말씀해 주세요.',
        },
      ]);
    }, 800);
  });
};

const InterviewQuestionNotePage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<InterviewQuestionAiDto[] | null>(null);
  const [originalQuestions, setOriginalQuestions] = useState<InterviewQuestionAiDto[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, questionRes] = await Promise.all([
          mockFetchUserProfile(),
          mockFetchQuestions(),
        ]);
        setUser(userRes);
        setQuestions(questionRes);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleEnterEditMode = () => {
    if (!questions) return;
    setOriginalQuestions(questions);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    if (originalQuestions) {
      setQuestions(originalQuestions);
    }
    setIsEditMode(false);
    setOriginalQuestions(null);
  };

  const handleSaveEdit = () => {
    // TODO: 추후 여기서 API 호출로 서버에 저장
    setIsEditMode(false);
    setOriginalQuestions(null);
  };

  const handleContentChange = (index: number, value: string) => {
    setQuestions((prev) => {
      if (!prev) return prev;
      const copy = [...prev];
      copy[index] = { ...copy[index], content: value };
      return copy;
    });
  };

  const handleTypeChange = (index: number, value: string) => {
    setQuestions((prev) => {
      if (!prev) return prev;
      const copy = [...prev];
      copy[index] = { ...copy[index], questionType: value };
      return copy;
    });
  };

  const renderQuestions = () => {
    if (isLoading || !questions || questions.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-transparent" />
          <p className="text-sm text-slate-500">질문이 생성중입니다.</p>
        </div>
      );
    }

    // index 포함해서 타입별 그룹핑
    const questionsWithIndex = questions.map((q, idx) => ({
      ...q,
      index: idx,
    }));

    const grouped = questionsWithIndex.reduce(
      (acc: Record<string, { questionType: string; content: string; index: number }[]>, q) => {
        if (!acc[q.questionType]) acc[q.questionType] = [];
        acc[q.questionType].push(q);
        return acc;
      },
      {}
    );

    const typeOrder = ['TECH', 'CORE', 'BEHAVIOR'];
    const typeLabel: Record<string, string> = {
      TECH: '기술 역량 질문 (TECH)',
      CORE: '공통/핵심 역량 질문 (CORE)',
      BEHAVIOR: '태도/경험 질문 (BEHAVIOR)',
    };

    const sortedTypes = Object.keys(grouped).sort((a, b) => {
      const ia = typeOrder.indexOf(a);
      const ib = typeOrder.indexOf(b);
      const sa = ia === -1 ? 99 : ia;
      const sb = ib === -1 ? 99 : ib;
      return sa - sb;
    });

    const typeOptions = ['TECH', 'CORE', 'BEHAVIOR'];

    return (
      <div className="flex flex-col gap-6">
        {sortedTypes.map((type) => (
          <section key={type} className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-slate-900">{typeLabel[type] ?? type}</h2>
            <div className="flex flex-col gap-2.5">
              {grouped[type].map((q) => (
                <div
                  key={`${type}-${q.index}`}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
                >
                  {isEditMode ? (
                    <div className="flex items-center gap-2">
                      <label className="text-[11px] text-slate-500">타입</label>
                      <select
                        className="h-7 rounded-md border border-slate-300 bg-white px-2 text-[11px]"
                        value={q.questionType}
                        onChange={(e) => handleTypeChange(q.index, e.target.value)}
                      >
                        {typeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span className="inline-flex items-center self-start rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
                      {q.questionType}
                    </span>
                  )}

                  {isEditMode ? (
                    <textarea
                      className="min-h-[60px] w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-800 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-300"
                      value={q.content}
                      onChange={(e) => handleContentChange(q.index, e.target.value)}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-800">{q.content}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-slate-100 px-5 py-6">
      <main className="flex w-full max-w-6xl gap-5">
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

        {/* 오른쪽 질문 패널 */}
        <section className="flex flex-1">
          <div className="flex flex-1 flex-col rounded-2xl bg-white px-6 py-5 shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-base font-semibold text-slate-900">질문 목록</h1>

              {/* 보기 / 수정 모드 토글 및 저장/취소 */}
              {isEditMode ? (
                <div className="flex items-center gap-2">
                  <button
                    className="inline-flex items-center rounded-full bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-300"
                    onClick={handleCancelEdit}
                  >
                    취소
                  </button>
                  <button
                    className="inline-flex items-center rounded-full bg-purple-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-800"
                    onClick={handleSaveEdit}
                  >
                    저장
                  </button>
                </div>
              ) : (
                <button
                  className="inline-flex items-center rounded-full bg-purple-700 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-purple-800 disabled:opacity-50"
                  disabled={isLoading || !questions || questions.length === 0}
                  onClick={handleEnterEditMode}
                >
                  질문 수정
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto">{renderQuestions()}</div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default InterviewQuestionNotePage;
