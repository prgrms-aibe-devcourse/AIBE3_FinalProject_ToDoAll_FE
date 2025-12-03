import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

import InterviewSummarySection from '../components/chat/InterviewSummarySection';
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

// =====================
// 타입 & 초기 프로필
// =====================

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
  const [profileError, setProfileError] = useState<string | null>(null);

  const [questionNotes, setQuestionNotes] = useState<QuestionSection[]>([]);
  const [questionError, setQuestionError] = useState<string | null>(null);

  const [summaries, setSummaries] = useState<InterviewSummary[]>([]);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  // 0) 인터뷰 ID 없으면 뒤로
  useEffect(() => {
    if (!numericInterviewId) {
      navigate('/interview/manage');
    }
  }, [numericInterviewId, navigate]);

  // 1) 프로필 로딩 (InterviewQuestionNotePage와 동일 패턴)
  useEffect(() => {
    const loadProfile = async () => {
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

      try {
        if (resumeId && interviewIdParam) {
          const res = await fetch(
            `${apiBaseUrl}/api/v1/interviews/${interviewIdParam}/interview-profile`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            }
          );

          if (res.ok) {
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

        // 실패하거나 resumeId 없으면 기본값만
        setProfileData(baseProfile);
      } catch (e) {
        console.error('프로필 로딩 실패:', e);
        setProfileError('면접자 프로필을 불러오는 중 오류가 발생했습니다.');
        setProfileData(baseProfile);
      }
    };

    loadProfile();
  }, [name, position, date, time, interviewers, resumeId, interviewIdParam]);

  // =====================
  // 2) 질문 로딩 (체크 상태 포함)
  // =====================
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

  // =====================
  // 3) 메모 + AI 요약 로딩
  //    - summaries: 면접관 메모들 (오른쪽)
  //    - aiSummary: 중앙 질문 목록 아래에 한 덩어리로 표시
  // =====================
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

  // @ts-ignore
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
        {/* 왼쪽: 지원자 정보 + 점수 */}
        <div className="flex w-1/4 flex-col gap-4">
          {profileError && <p className="text-xs text-red-500">{profileError}</p>}
          <ProfileCard profileData={profileData} name={name} avatar={avatar} />
          <ScoreInputCard />
        </div>

        {/* 가운데: 질문 목록 + AI 요약 */}
        <div className="flex flex-1 flex-col gap-4 overflow-auto">
          {questionError && <p className="mb-2 text-xs text-red-500">{questionError}</p>}

          <QuestionNoteSection questionNotes={questionNotes} />

          {/* AI 요약 박스 */}
          <div className="mt-4 flex min-h-[180px] flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-3 text-base font-semibold text-slate-900">면접 요약</h2>

            {aiSummary ? (
              <p className="flex-1 text-sm leading-relaxed whitespace-pre-line text-slate-800">
                {aiSummary}
              </p>
            ) : (
              <div className="flex-1 text-sm leading-relaxed text-slate-400">
                <p>아직 생성된 면접 요약이 없습니다.</p>
                <p className="mt-1">면접 채팅 기록을 기반으로 AI가 자동으로 요약을 생성합니다.</p>
              </div>
            )}
          </div>
        </div>
        {/* ✅ 여기서 "가운데" div 닫힘 */}

        {/* 오른쪽: 면접관 메모 - "가운데"와 같은 레벨! */}
        <div className="flex w-1/4 flex-col overflow-auto">
          {summaryError && <p className="mb-1 text-xs text-red-500">{summaryError}</p>}
          <InterviewSummarySection summaries={summaries} currentUserId={0} />
        </div>
      </div>
      {/* ✅ 여기서 "본문" div 닫힘 */}
    </div>
    // ✅ 여기서 최상위 컨테이너 닫힘
  );
}
