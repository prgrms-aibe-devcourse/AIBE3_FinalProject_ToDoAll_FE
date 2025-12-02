// src/pages/InterviewQuestionNotePage.tsx

import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProfileCard from '../components/question-create/ProfileCard';
import EditButton from '../components/question-create/EditButton';
import type { ApiResponse } from '@/features/jd/services/jobApi';

type InterviewQuestionResponseDto = {
  questionId: number;
  questionType: string;
  content: string;
};

type InterviewQuestionAiDto = {
  id: number;
  questionType: string;
  content: string;
};

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

const InterviewQuestionNotePage: React.FC = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const location = useLocation();
  const { name, avatar } = (location.state as { name?: string; avatar?: string }) || {};

  const [questions, setQuestions] = useState<InterviewQuestionAiDto[] | null>(null);
  const [originalQuestions, setOriginalQuestions] = useState<InterviewQuestionAiDto[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || '';

  // ====== GET: 질문 조회 ======
  const fetchQuestions = async () => {
    if (!interviewId) {
      setLoadError('면접 ID가 없습니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const res = await fetch(`${apiBaseUrl}/api/v1/interviews/${interviewId}/questions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Fetch error:', res.status, text);
        throw new Error(`HTTP ${res.status}`);
      }

      const body: ApiResponse<InterviewQuestionResponseDto[]> = await res.json();

      const mapped: InterviewQuestionAiDto[] =
        body.data?.map((q) => ({
          id: q.questionId,
          questionType: q.questionType,
          content: q.content,
        })) ?? [];

      setQuestions(mapped);
    } catch (err) {
      console.error(err);
      setLoadError('질문을 불러오는 중 오류가 발생했습니다.');
      setQuestions(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interviewId]);

  // ====== PUT: 질문 수정/저장 ======
  const saveQuestions = async () => {
    if (!interviewId || !questions) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      // 백엔드 InterviewQuestionUpdateRequestDto 구조에 맞게 수정
      const updatePayload = {
        questions: questions.map((q) => ({
          questionId: q.id,
          questionType: q.questionType,
          content: q.content,
        })),
      };

      const res = await fetch(`${apiBaseUrl}/api/v1/interviews/${interviewId}/questions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('PUT error:', res.status, text);
        throw new Error(`HTTP ${res.status}`);
      }

      setOriginalQuestions(null);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setSaveError('질문을 저장하는 중 오류가 발생했습니다.');
      // 롤백
      if (originalQuestions) {
        setQuestions(originalQuestions);
      }
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  // 보기 ↔ 수정 토글 + 저장 트리거
  const handleToggleEdit = () => {
    // 보기 → 수정
    if (!isEditing) {
      if (questions) {
        setOriginalQuestions(questions);
      }
      setSaveError(null);
      setIsEditing(true);
      return;
    }

    // 수정 → 보기 (저장 시도)
    if (!questions) {
      setIsEditing(false);
      return;
    }

    void saveQuestions();
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
    if (isLoading) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-transparent" />
          <p className="text-sm text-slate-500">질문이 생성중입니다.</p>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          <p className="text-sm text-red-500">{loadError}</p>
          <button
            type="button"
            onClick={fetchQuestions}
            className="rounded-full bg-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-300"
          >
            다시 불러오기
          </button>
        </div>
      );
    }

    if (!questions || questions.length === 0) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-200 border-t-transparent" />
          <p className="text-sm text-slate-500">질문이 생성중입니다.</p>
        </div>
      );
    }

    const questionsWithIndex = questions.map((q, idx) => ({ ...q, index: idx }));

    const grouped = questionsWithIndex.reduce(
      (
        acc: Record<string, { id: number; questionType: string; content: string; index: number }[]>,
        q
      ) => {
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
                  key={q.id}
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
        {/* 왼쪽 프로필 */}
        <div className="w-1/4">
          <ProfileCard
            profileData={initialProfileData}
            name={name ?? initialProfileData.name}
            avatar={avatar}
          />
        </div>

        {/* 오른쪽 질문 영역 */}
        <div className="w-3/4">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-sm leading-relaxed shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">질문 목록</h2>
              {isSaving && <span className="text-xs text-slate-500">저장 중...</span>}
            </div>

            {saveError && (
              <div className="mb-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
                {saveError}
              </div>
            )}

            {renderQuestions()}
          </div>

          {/* 보기/수정 토글 + 저장 트리거 */}
          <EditButton isEditing={isEditing} onToggle={handleToggleEdit} />
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionNotePage;
