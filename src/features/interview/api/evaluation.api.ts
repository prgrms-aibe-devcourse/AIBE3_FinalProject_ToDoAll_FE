// src/features/interview/services/evaluation.api.ts
import type { ApiResponse } from '@features/jd/services/jobApi';

export type InterviewEvaluationDto = {
  evaluationId: number;
  scoreTech: number;
  scoreComm: number;
  scoreOverall: number;
  comment: string;
};

const API_BASE = import.meta.env.VITE_API_URL;

// 1) 면접 평가 조회 (GET)
export async function getInterviewEvaluation(
  interviewId: number
): Promise<InterviewEvaluationDto | null> {
  const res = await fetch(`${API_BASE}/api/v1/interviews/${interviewId}/evaluation`, {
    credentials: 'include',
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error('평가 조회 실패');

  const body: ApiResponse<InterviewEvaluationDto> = await res.json();

  // data 없으면 null 넘기기
  return body.data ?? null;
}

// 2) 면접 평가 생성 (POST)
export async function createInterviewEvaluation(
  interviewId: number,
  payload: { scoreTech: number; scoreComm: number; scoreOverall: number; comment: string }
): Promise<InterviewEvaluationDto> {
  const res = await fetch(`${API_BASE}/api/v1/interviews/${interviewId}/evaluation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('평가 생성 실패');

  const body: ApiResponse<InterviewEvaluationDto> = await res.json();

  // 여기서 한 번 체크해서 TS 한테 "undefined 아님"이라고 확신 주기
  if (!body.data) {
    throw new Error('평가 생성 응답에 data가 없습니다.');
  }

  return body.data;
}

// 3) 면접 평가 수정 (PATCH)
export async function updateInterviewEvaluation(
  interviewId: number,
  evaluationId: number,
  payload: { scoreTech: number; scoreComm: number; scoreOverall: number; comment: string }
): Promise<InterviewEvaluationDto> {
  const res = await fetch(
    `${API_BASE}/api/v1/interviews/${interviewId}/evaluation/${evaluationId}`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error('평가 수정 실패');

  const body: ApiResponse<InterviewEvaluationDto> = await res.json();

  if (!body.data) {
    throw new Error('평가 수정 응답에 data가 없습니다.');
  }

  return body.data;
}
