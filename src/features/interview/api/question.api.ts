import { authedRequest } from '@/lib/utils/authedRequest';

export interface InterviewQuestion {
  questionId: number;
  questionType: string;
  content: string;
  checked?: boolean;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  sender: string;
  content: string;
  createdAt: string;
}

export interface InterviewMemo {
  memoId: number;
  content: string;
  author: {
    userId: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

type CommonResponse<T> = {
  errorCode: number;
  message: string;
  data: T;
};

export async function getInterviewQuestions(interviewId: number): Promise<InterviewQuestion[]> {
  const res = await authedRequest<CommonResponse<InterviewQuestion[]>>(
    `/api/v1/interviews/${interviewId}/questions`,
    { method: 'GET' }
  );
  return res.data ?? [];
}

export async function toggleQuestionCheck(
  interviewId: number,
  questionId: number
): Promise<InterviewQuestion> {
  const res = await authedRequest<CommonResponse<InterviewQuestion>>(
    `/api/v1/interviews/${interviewId}/questions/${questionId}/toggle-check`,
    { method: 'PATCH' }
  );
  return res.data;
}

export async function getChatHistory(interviewId: number): Promise<ChatMessage[]> {
  const res = await authedRequest<CommonResponse<ChatMessage[]>>(
    `/api/v1/interviews/${interviewId}/chat`,
    { method: 'GET' }
  );
  return res.data ?? [];
}

export async function getInterviewMemos(interviewId: number): Promise<InterviewMemo[]> {
  const res = await authedRequest<CommonResponse<InterviewMemo[]>>(
    `/api/v1/interviews/${interviewId}/memos`,
    { method: 'GET' }
  );
  return res.data ?? [];
}

export async function updateInterviewMemo(
  interviewId: number,
  memoId: number,
  content: string
): Promise<{ memoId: number; content: string; updatedAt: string }> {
  const res = await authedRequest<
    CommonResponse<{ memoId: number; content: string; updatedAt: string }>
  >(`/api/v1/interviews/${interviewId}/memos/${memoId}`, {
    method: 'PATCH', // 서버가 PUT이면 PUT으로 변경
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  return res.data;
}
