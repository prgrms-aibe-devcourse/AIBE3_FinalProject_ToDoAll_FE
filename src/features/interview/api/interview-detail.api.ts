// src/features/interview/api/interview-detail.api.ts
import { authedRequest } from '@/lib/utils/authedRequest';

type CommonResponse<T> = {
  errorCode?: number;
  message: string;
  data: T;
};

export type InterviewDetail = {
  interviewId: number;
  resumeId: number;
  candidateAvatar?: string | null;

  // 백엔드에서 내려주면 좋음(없어도 동작)
  candidateUserId?: number | null;

  // 필요하면 확장
  candidateName?: string | null;
  jdId?: number;
  jdTitle?: string | null;
  status?: string | null;
  scheduledAt?: string | null;
  createdAt?: string | null;
};

/** 로그인 사용자(Authorization)로 호출 */
export async function getInterviewDetailAuthed(interviewId: number): Promise<InterviewDetail> {
  const raw = await authedRequest<CommonResponse<InterviewDetail>>(
    `/api/v1/interviews/${interviewId}`,
    {
      method: 'GET',
    }
  );
  return raw.data;
}

/** 게스트(Interview-Token 헤더)로 호출 */
export async function getInterviewDetailWithGuestToken(
  interviewId: number,
  guestToken: string
): Promise<InterviewDetail> {
  const BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
  const url = `${BASE_URL}/api/v1/interviews/${interviewId}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Interview-Token': guestToken,
    },
    credentials: 'include',
  });

  let body: any = null;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    throw new Error(body?.message ?? `요청 실패 (status=${res.status})`);
  }

  return (body?.data ?? body) as InterviewDetail;
}
