import { request } from '@/lib/utils/base';

export interface InterviewQuestion {
  questionId: number;
  questionType: string;
  content: string;
  checked?: boolean;
}

export async function getInterviewQuestions(interviewId: number): Promise<InterviewQuestion[]> {
  const res = await request<{ errorCode: number; message: string; data: InterviewQuestion[] }>(
    `/api/v1/interviews/${interviewId}/questions`,
    {
      method: 'GET',
    }
  );

  return res?.data ?? [];
}

export async function toggleQuestionCheck(
  interviewId: number,
  questionId: number
): Promise<InterviewQuestion> {
  const res = await request<{ errorCode: number; message: string; data: InterviewQuestion }>(
    `/api/v1/interviews/${interviewId}/questions/${questionId}/toggle-check`,
    {
      method: 'PATCH',
    }
  );

  return res?.data ?? res;
}
