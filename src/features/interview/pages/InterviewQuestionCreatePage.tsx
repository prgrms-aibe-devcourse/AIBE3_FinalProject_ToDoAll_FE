// src/pages/InterviewQuestionNotePage.tsx

import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProfileCard from '../components/question-create/ProfileCard';
import EditButton from '../components/question-create/EditButton';
import type { ApiResponse } from '@/features/jd/services/jobApi';
import PageTitle from '@shared/components/PageTitile.tsx';

type InterviewQuestionResponseDto = {
  questionId: number;
  questionType: string;
  content: string;
};

type InterviewQuestionAiDto = {
  id: number | null;
  questionType: string;
  content: string;
};

type ProfileData = {
  name: string;
  title: string;
  date: string;
  time: string;
  interviewers: string[];
  skills: string[];
  missingSkills: string[];
  experiences: string[];
  image: string;
};

const initialProfileData: ProfileData = {
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
  const {
    name: name,
    avatar,
    date,
    time,
    interviewers,
    position,
    resumeId,
  } = (location.state ?? {}) as {
    name?: string;
    avatar?: string;
    interviewId?: number;
    date?: string;
    time?: string;
    interviewers?: string;
    position?: string;
    resumeId?: number;
  };

  const pollTimerRef = useRef<number | null>(null);

  const [questions, setQuestions] = useState<InterviewQuestionAiDto[] | null>(null);
  const [originalQuestions, setOriginalQuestions] = useState<InterviewQuestionAiDto[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);

  const apiBaseUrl = import.meta.env.VITE_API_URL || '';

  const fetchQuestions = async (): Promise<boolean> => {
    if (!interviewId) {
      setLoadError('면접 ID가 없습니다.');
      setIsLoading(false);
      return true;
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
      return mapped.length > 0;
    } catch (err) {
      console.error(err);
      setLoadError('질문을 불러오는 중 오류가 발생했습니다.');
      setQuestions(null);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      const ready = await fetchQuestions();
      if (cancelled) return;

      if (!ready) {
        pollTimerRef.current = window.setTimeout(poll, 5000);
      }
    };

    void poll();

    return () => {
      cancelled = true;
      if (pollTimerRef.current) window.clearTimeout(pollTimerRef.current);
    };
  }, [interviewId]);

  useEffect(() => {
    const loadProfile = async () => {
      // 1) 우선 라우터 state 기반으로 기본 값 구성
      const baseProfile: ProfileData = {
        ...initialProfileData,
        name: name ?? initialProfileData.name,
        title: position ?? initialProfileData.title,
        date: date ?? initialProfileData.date,
        time: time ?? initialProfileData.time,
        interviewers: interviewers
          ? interviewers.split(',').map((s) => s.trim())
          : initialProfileData.interviewers,
      };

      // 2) resumeId 가 있으면 → API 로 스킬/경험 보강 (엔드포인트는 예시)
      try {
        if (resumeId) {
          const res = await fetch(
            `${apiBaseUrl}/api/v1/interviews/${interviewId}/interview-profile`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            }
          );

          if (res.ok) {
            // 예시: 백엔드 응답 형태
            // { data: { skills: string[], missingSkills: string[], experiences: string[] } }
            type ProfileApiDto = {
              skills: string[];
              missingSkills: string[];
              experiences: string[];
            };

            const body: ApiResponse<ProfileApiDto> = await res.json();

            setProfileData({
              ...baseProfile,
              skills: body.data?.skills ?? baseProfile.skills,
              missingSkills: body.data?.missingSkills ?? baseProfile.missingSkills,
              experiences: body.data?.experiences ?? baseProfile.experiences,
            });
            return;
          }
        }

        // 3) resumeId 없거나 API 실패 → state 기반 기본 값만 사용
        setProfileData(baseProfile);
      } catch (e) {
        console.error('프로필 로딩 실패:', e);
        setProfileData(baseProfile);
      }
    };

    loadProfile();
  }, [name, position, date, time, interviewers, resumeId, apiBaseUrl]);

  const saveQuestions = async () => {
    if (!interviewId || !questions) return;

    setIsSaving(true);
    setSaveError(null);

    try {
      const updatePayload = {
        questions: questions
          .filter((q) => q.content.trim().length > 0)
          .map((q) => ({
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

      if (originalQuestions) {
        setQuestions(originalQuestions);
      }
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEdit = () => {
    if (!isEditing) {
      if (questions) {
        setOriginalQuestions(questions);
      }
      setSaveError(null);
      setIsEditing(true);
      return;
    }

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

  const handleAddQuestion = (questionType: 'TECH' | 'CORE' | 'BEHAVIOR') => {
    setQuestions((prev) => {
      if (!prev) return prev;
      return [
        ...prev,
        {
          id: null,
          questionType,
          content: '',
        },
      ];
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
        acc: Record<
          string,
          { id: number | null; questionType: string; content: string; index: number }[]
        >,
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
    const typeOptions: ('TECH' | 'CORE' | 'BEHAVIOR')[] = ['TECH', 'CORE', 'BEHAVIOR'];

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
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">{typeLabel[type] ?? type}</h2>

              {isEditing && (
                <button
                  type="button"
                  onClick={() => handleAddQuestion(type as 'TECH' | 'CORE' | 'BEHAVIOR')}
                  className="rounded-full border border-purple-200 px-3 py-1 text-[11px] font-semibold text-purple-700 hover:bg-purple-50"
                >
                  + {typeLabel[type] ? typeLabel[type].split(' ')[0] : type} 질문 추가
                </button>
              )}
            </div>

            <div className="flex flex-col gap-2.5">
              {grouped[type].map((q) => (
                <div
                  key={q.id ?? `new-${type}-${q.index}`}
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
    <PageTitle title={'질문 노트'} description={''}>
      <div className="flex flex-col gap-8 md:flex-row">
        <ProfileCard profileData={profileData} name={name} avatar={avatar} />

        <div className="w-full">
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

          <EditButton isEditing={isEditing} onToggle={handleToggleEdit} />
        </div>
      </div>
    </PageTitle>
  );
};

export default InterviewQuestionNotePage;
