// src/features/interview/services/evaluation.api.ts
import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

export type InterviewEvaluationDto = {
  evaluationId: number;
  scoreTech: number;
  scoreComm: number;
  scoreOverall: number;
  comment: string;
};

// 1) 면접 평가 조회 (GET)
export async function getInterviewEvaluation(
  client: ClientRequestType,
  interviewId: number
): Promise<InterviewEvaluationDto | null> {
  const res = await client.request<InterviewEvaluationDto>(
    `/api/v1/interviews/${interviewId}/evaluation`,
    {},
    '평가 조회 실패'
  );

  return res ?? null;
}

// 2) 면접 평가 생성 (POST)
export async function createInterviewEvaluation(
  client: ClientRequestType,
  interviewId: number,
  payload: { scoreTech: number; scoreComm: number; scoreOverall: number; comment: string }
): Promise<InterviewEvaluationDto> {
  const res = await client.request<InterviewEvaluationDto>(
    `/api/v1/interviews/${interviewId}/evaluation`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    },
    '평가 생성 실패'
  );

  if (!res) throw new Error('평가 생성 응답에 data가 없습니다.');

  return res;
}

// 3) 면접 평가 수정 (PATCH)
export async function updateInterviewEvaluation(
  client: ClientRequestType,
  interviewId: number,
  evaluationId: number,
  payload: { scoreTech: number; scoreComm: number; scoreOverall: number; comment: string }
): Promise<InterviewEvaluationDto> {
  const res = await client.request<InterviewEvaluationDto>(
    `/api/v1/interviews/${interviewId}/evaluation/${evaluationId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
    '평가 수정 실패'
  );

  if (!res) throw new Error('평가 수정 응답에 data가 없습니다.');

  return res;
}
