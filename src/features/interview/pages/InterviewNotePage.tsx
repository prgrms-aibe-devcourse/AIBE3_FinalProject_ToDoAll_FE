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

// 타입 & 초기 프로필

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
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  const [questionNotes, setQuestionNotes] = useState<QuestionSection[]>([]);
  const [, setQuestionError] = useState<string | null>(null);

  const [summaries, setSummaries] = useState<InterviewSummary[]>([]);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');

  // 내 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();
        setMe(user);
      } catch (e) {
        console.error('내 정보 조회 실패:', e);
      }
    })();
  }, []);

  // 0) 인터뷰 ID 없으면 뒤로
  useEffect(() => {
    if (!numericInterviewId) {
      navigate('/interview/manage');
    }
  }, [numericInterviewId, navigate]);

  // 1) Profile API 를 useFetch 로 호출
  const { resData: profileApi } = useFetch<ProfileApiDto>(
    resumeId && interviewIdParam ? `/api/v1/interviews/${interviewIdParam}/interview-profile` : ''
  );

  // profileApi가 오면 프로필 업데이트
  useEffect(() => {
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

    if (profileApi) {
      setProfileData({
        ...baseProfile,
        skills: profileApi.skills ?? baseProfile.skills,
        missingSkills: profileApi.missingSkills ?? baseProfile.missingSkills,
        experiences: profileApi.experiences ?? baseProfile.experiences,
      });
    } else {
      setProfileData(baseProfile);
    }
  }, [profileApi, name, position, date, time, interviewers]);

  // 2) 질문 로딩 (체크 상태 포함)
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        const questions = await getInterviewQuestions(numericInterviewId);

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
  }, [numericInterviewId]);
  // 3) 메모 + AI 요약 로딩
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        // 3-1) 메모 목록
        const memos = await getInterviewMemos(numericInterviewId);

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
    <div className="bg-jd-white text-jd-black flex h-screen flex-col overflow-hidden">
      <header className="flex shrink-0 items-center justify-between px-10 pt-6">
        <h1 className="text-jd-black text-2xl font-bold">면접 노트</h1>

        <button
          onClick={() => navigate('/interview/manage')}
          className="text-jd-gray-dark hover:text-jd-black text-sm transition"
        >
          ← 돌아가기
        </button>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* 왼쪽: 고정폭 + shrink 방지 */}
        <div className="flex w-[280px] min-w-[280px] shrink-0 flex-col gap-3">
          <ProfileCard profileData={profileData} name={name} avatar={avatar} />
          <ScoreInputCard interviewId={numericInterviewId} />
        </div>

        {/* 가운데 60% → 질문 + AI 요약 */}
        <div className="mb-3 flex w-[60%] min-w-[600px] flex-col gap-4 overflow-auto">
          {/* ❌ wrapper 카드 제거하고, 그냥 섹션만 */}
          <QuestionNoteSection questionNotes={questionNotes} />

          {/* AI 요약 카드만 단일 카드로 유지 */}
          <div className="mt-4 mb-3 min-h-[200px] w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-3 text-base font-semibold text-slate-900">AI 면접 요약</h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-slate-800">
              {aiSummary || '아직 생성된 면접 요약이 없습니다.'}
            </p>
          </div>
        </div>

        {/* 오른쪽: 면접관 메모만 */}
        <div className="flex w-[26%] min-w-[300px] flex-col overflow-hidden">
          {summaryError && <p className="mb-1 text-xs text-red-500">{summaryError}</p>}
          <InterviewNoteSummarySection
            summaries={summaries}
            currentUserId={me?.id ?? 0}
            onUpdateMemo={handleUpdateMemo}
          />
        </div>
      </div>
    </div>
  );
}
