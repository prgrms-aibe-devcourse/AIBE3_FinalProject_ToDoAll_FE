// src/features/interview/api/interview-detail.api.ts
import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

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
export async function getInterviewDetailAuthed(
  client: ClientRequestType,
  interviewId: number
): Promise<InterviewDetail> {
  const raw = await client.request<InterviewDetail>(`/api/v1/interviews/${interviewId}`, {
    method: 'GET',
  });
  return raw!;
}

/** 게스트(Interview-Token 헤더)로 호출 */
export async function getInterviewDetailWithGuestToken(
  client: ClientRequestType,
  interviewId: number,
  guestToken: string
): Promise<InterviewDetail> {
  const res = await client.request<InterviewDetail>(`/api/v1/interviews/${interviewId}`, {
    method: 'GET',
    headers: {
      'Interview-Token': guestToken,
    },
  });

  return res!;
}
