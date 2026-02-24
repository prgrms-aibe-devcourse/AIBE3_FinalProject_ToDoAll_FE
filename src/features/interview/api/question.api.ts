import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

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

export async function getInterviewQuestions(
  client: ClientRequestType,
  interviewId: number
): Promise<InterviewQuestion[]> {
  const res = await client.request<InterviewQuestion[]>(
    `/api/v1/interviews/${interviewId}/questions`,
    { method: 'GET' }
  );

  return res ?? [];
}

export async function toggleQuestionCheck(
  client: ClientRequestType,
  interviewId: number,
  questionId: number
): Promise<InterviewQuestion> {
  const res = await client.request<InterviewQuestion>(
    `/api/v1/interviews/${interviewId}/questions/${questionId}/toggle-check`,
    { method: 'PATCH' }
  );

  return res!;
}

export async function getChatHistory(
  client: ClientRequestType,
  interviewId: number
): Promise<ChatMessage[]> {
  const res = await client.request<ChatMessage[]>(`/api/v1/interviews/${interviewId}/chat`, {
    method: 'GET',
  });

  return res ?? [];
}

export async function getChatHistoryWithGuestToken(
  client: ClientRequestType,
  interviewId: number,
  guestToken: string
): Promise<ChatMessage[]> {
  const res = await client.request<ChatMessage[]>(`/api/v1/interviews/${interviewId}/chat`, {
    method: 'GET',
    headers: {
      'Interview-Token': guestToken,
    },
  });

  return res ?? [];
}

export async function getInterviewMemos(
  client: ClientRequestType,
  interviewId: number
): Promise<InterviewMemo[]> {
  const res = await client.request<InterviewMemo[]>(`/api/v1/interviews/${interviewId}/memos`, {
    method: 'GET',
  });

  return res ?? [];
}

export async function updateInterviewMemo(
  client: ClientRequestType,
  interviewId: number,
  memoId: number,
  content: string
): Promise<{ memoId: number; content: string; updatedAt: string }> {
  const res = await client.request<{ memoId: number; content: string; updatedAt: string }>(
    `/api/v1/interviews/${interviewId}/memos/${memoId}`,
    {
      method: 'PATCH', // 서버가 PUT이면 PUT으로 변경
      body: { content },
    }
  );

  return res!;
}
