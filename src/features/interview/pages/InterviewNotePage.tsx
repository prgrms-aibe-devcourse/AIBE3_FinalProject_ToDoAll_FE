import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InterviewNoteSummarySection from '../components/note/InterviewNoteSummarySection';
import type { QuestionSection, InterviewSummary } from '../types/chatroom';
import ProfileCard from '../components/question-create/ProfileCard';
import QuestionNoteSection from '../components/note/QuestionNoteSection';
import ScoreInputCard from '../components/note/ScoreInputCard';

import type { ApiResponse } from '@features/jd/services/jobApi.ts';
import {
  getInterviewMemos,
  getInterviewQuestions,
  type InterviewMemo,
  type InterviewQuestion,
} from '@features/interview/api/question.api.ts';

// 내 정보 조회용
import { getMe } from '@/features/user/api/user.api';
import useFetch from '@shared/hooks/useFetch';
import { useAuthedClient } from '@shared/hooks/useAuthClient.ts';
import PageTitle from '@shared/components/PageTitile.tsx';

// 타입 & 초기 프로필

export type ProfileData = {
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

type ProfileApiDto = {
  skills: string[];
  missingSkills: string[];
  experiences: string[];
};

const apiBaseUrl = import.meta.env.VITE_API_URL || '';

export default function InterviewNotePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { interviewId: interviewIdParam } = useParams<{ interviewId: string }>();

  const numericInterviewId = Number(interviewIdParam);

  // 내 정보 상태
  const [me, setMe] = useState<any>(null);

  // 라우터 state에서 면접자 기본 정보 가져오기
  const { name, avatar, date, time, interviewers, position, resumeId } = (location.state ?? {}) as {
    name?: string;
    avatar?: string;
    interviewId?: number;
    date?: string;
    time?: string;
    interviewers?: string;
    position?: string;
    resumeId?: number;
  };

  // 상태
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [questionNotes, setQuestionNotes] = useState<QuestionSection[]>([]);
  const [, setQuestionError] = useState<string | null>(null);

  const [summaries, setSummaries] = useState<InterviewSummary[]>([]);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');

  const client = useAuthedClient();

  useEffect(() => {
    (async () => {
      try {
        const user = await getMe(client);
        setMe(user);
      } catch (e) {
        console.error('내 정보 조회 실패:', e);
      }
    })();
  }, [client]);

  useEffect(() => {
    if (!numericInterviewId) {
      navigate('/interview/manage');
    }
  }, [numericInterviewId, navigate]);

  const { resData: profileApi } = useFetch<ProfileApiDto>(
    resumeId && interviewIdParam ? `/api/v1/interviews/${interviewIdParam}/interview-profile` : ''
  );

  useEffect(() => {
    if (!profileApi) return;

    const baseProfile: ProfileData = {
      name: name ?? '',
      title: position ?? '',
      date: date ?? '',
      time: time ?? '',
      interviewers: interviewers ? interviewers.split(',').map((s) => s.trim()) : [],
      skills: [],
      missingSkills: [],
      experiences: [],
      image: '',
    };

    setProfileData({
      ...baseProfile,
      skills: profileApi.skills ?? baseProfile.skills,
      missingSkills: profileApi.missingSkills ?? baseProfile.missingSkills,
      experiences: profileApi.experiences ?? baseProfile.experiences,
    });
  }, [profileApi, name, position, date, time, interviewers]);

  // 2) 질문 로딩 (체크 상태 포함)
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        const questions = await getInterviewQuestions(client, numericInterviewId);

        const map = new Map<string, InterviewQuestion[]>();

        questions.forEach((q: InterviewQuestion) => {
          const topic = q.questionType ?? '기타';
          if (!map.has(topic)) map.set(topic, []);
          map.get(topic)!.push(q);
        });

        setQuestionNotes(
          Array.from(map.entries()).map(([topic, questionList]) => ({
            topic,
            questions: questionList.map((q) => ({
              id: q.questionId,
              content: q.content,
              checked: q.checked ?? false,
            })),
          }))
        );
      } catch (e) {
        console.error('질문 불러오기 실패:', e);
        setQuestionError('질문을 불러오는 중 오류가 발생했습니다.');
      }
    })();
  }, [client, numericInterviewId]);
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        const memos = await getInterviewMemos(client, numericInterviewId);

        const memoMap = new Map<number, InterviewMemo>();
        memos.forEach((memo: InterviewMemo) => {
          const userId = memo.author.userId;
          const existing = memoMap.get(userId);
          if (!existing || new Date(memo.updatedAt) > new Date(existing.updatedAt)) {
            memoMap.set(userId, memo);
          }
        });

        // 3-2) InterviewSummary로 변환 (JSON content 파싱)
        const summaryList: InterviewSummary[] = Array.from(memoMap.values()).map((memo) => {
          let content = memo.content;

          try {
            const parsed = JSON.parse(memo.content);
            if (typeof parsed === 'object' && parsed && 'content' in parsed) {
              let finalContent = (parsed as any).content;
              while (typeof finalContent === 'string' && finalContent.startsWith('{')) {
                try {
                  const nested = JSON.parse(finalContent);
                  if (nested && typeof nested === 'object' && 'content' in nested) {
                    finalContent = nested.content;
                  } else break;
                } catch {
                  break;
                }
              }
              if (typeof finalContent === 'string') {
                content = finalContent;
              }
            }
          } catch {
            // JSON 아니면 그대로 둠
          }

          return {
            id: memo.memoId,
            authorId: memo.author.userId,
            title: `${memo.author.name} 면접관`,
            content,
          };
        });

        setSummaries(summaryList); // 오른쪽은 사람 메모만

        // 3-3) AI 요약 불러오기 → 문자열만 따로 보관
        let summaryText = '';

        try {
          // 1) 먼저 "조회"
          const res = await fetch(`${apiBaseUrl}/api/v1/interviews/${numericInterviewId}/summary`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (res.ok) {
            const body: ApiResponse<string | null> = await res.json();
            if (body.data && body.data.trim().length > 0) {
              // 이미 저장된 요약 있음
              summaryText = body.data;
              setAiSummary(summaryText);
              return;
            }
          }
          //  여기까지 왔다는 건 → 아직 요약이 없다는 뜻
          setAiSummary('AI가 면접 요약을 생성 중입니다...');

          //  2) 비동기 생성 요청만 보내고, 응답은 신경 안 씀
          await fetch(`${apiBaseUrl}/api/v1/interviews/${numericInterviewId}/summary/ai`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });
        } catch (e) {
          console.error('요약 API 호출 실패:', e);
        }

        if (!summaryText) {
          // 아직 생성 안 됐을 때 기본 문구
          setAiSummary('아직 생성된 면접 요약이 없습니다.');
        }
      } catch (e) {
        console.error('메모/요약 불러오기 실패:', e);
        setSummaryError('면접 메모/요약을 불러오는 중 오류가 발생했습니다.');
      }
    })();
  }, [numericInterviewId]);

  // 메모 수정 핸들러 (노트 페이지 전용)
  const handleUpdateMemo = async (memoId: number, content: string) => {
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/v1/interviews/${numericInterviewId}/memos/${memoId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ content }),
        }
      );

      if (!res.ok) {
        console.error('메모 수정 실패:', res.status);
        return;
      }

      // 성공 시 프론트 상태도 같이 업데이트
      setSummaries((prev) => prev.map((s) => (s.id === memoId ? { ...s, content } : s)));
    } catch (e) {
      console.error('메모 수정 중 오류:', e);
    }
  };

  return (
    <PageTitle
      title={'면접 노트'}
      description={'면접 결과 요약을 확인하세요.'}
      buttonOnClickFn={() => navigate('/interview/manage')}
      buttonText={'돌아가기'}
    >
      <div className="flex flex-1 flex-col gap-6 sm:flex-row">
        <div className="flex shrink-0 flex-col gap-3">
          <ProfileCard profileData={profileData} name={name} avatar={avatar} />
          <ScoreInputCard interviewId={numericInterviewId} />
        </div>

        <div className="mb-3 flex w-full flex-col gap-4 lg:flex-row">
          <div className="flex w-full flex-col gap-4">
            <div className="min-h-[200px] w-full overflow-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <h2 className="mb-3 text-base font-semibold text-slate-900">면접 질문</h2>
              {questionNotes.length > 0 ? (
                <QuestionNoteSection questionNotes={questionNotes} />
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-line text-slate-800">
                  생성된 면접 질문이 없습니다.
                </p>
              )}
            </div>

            <div className="min-h-[200px] w-full overflow-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
              <h2 className="mb-3 text-base font-semibold text-slate-900">AI 면접 요약</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-slate-800">
                {aiSummary || '아직 생성된 면접 요약이 없습니다.'}
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col overflow-hidden lg:w-[50%]">
            {summaryError && <p className="mb-1 text-xs text-red-500">{summaryError}</p>}
            <InterviewNoteSummarySection
              summaries={summaries}
              currentUserId={me?.id ?? 0}
              onUpdateMemo={handleUpdateMemo}
            />
          </div>
        </div>
      </div>
    </PageTitle>
  );
}
