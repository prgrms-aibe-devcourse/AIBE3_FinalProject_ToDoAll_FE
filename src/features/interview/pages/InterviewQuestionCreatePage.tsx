import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProfileCard from '../components/question-create/ProfileCard';
import EditButton from '../components/question-create/EditButton';

type InterviewQuestionAiDto = {
  questionType: string;
  content: string;
};

// 예전 페이지에서 쓰던 프로필 더미 데이터
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

// 실제 API 대신 사용하는 더미 fetch
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
  const location = useLocation();
  const { name, avatar } = location.state || {};

  const [questions, setQuestions] = useState<InterviewQuestionAiDto[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const questionRes = await mockFetchQuestions();
        setQuestions(questionRes);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

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

    const questionsWithIndex = questions.map((q, idx) => ({ ...q, index: idx }));

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
    const typeOptions = ['TECH', 'CORE', 'BEHAVIOR'];

    const sortedTypes = Object.keys(grouped).sort((a, b) => {
      const ia = typeOrder.indexOf(a);
      const ib = typeOrder.indexOf(b);
      const sa = ia === -1 ? 99 : ia;
      const sb = ib === -1 ? 99 : ib;
      return sa - sb;
    });

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
                  {isEditing ? (
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

                  {isEditing ? (
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
    <div className="mx-auto min-h-screen bg-[#fbf9f9] p-8 font-sans font-semibold">
      <h1 className="text-jd-black mb-6 text-2xl font-bold">질문 노트</h1>

      <div className="flex gap-8">
        {/* 왼쪽 프로필 카드 (기존 UI) */}
        <div className="w-1/4">
          <ProfileCard
            profileData={initialProfileData}
            name={name ?? initialProfileData.name}
            avatar={avatar}
          />
        </div>

        {/* 오른쪽 질문 영역 (새 UI + 타입별 그룹) */}
        <div className="w-3/4">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm leading-relaxed shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">질문 목록</h2>
            </div>

            {renderQuestions()}
          </div>

          {/* 기존 EditButton 컴포넌트로 보기/수정 토글 */}
          <EditButton isEditing={isEditing} onToggle={handleToggleEdit} />
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionNotePage;
