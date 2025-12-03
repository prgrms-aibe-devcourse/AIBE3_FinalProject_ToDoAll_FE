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

// 채팅 내역 조회 API
// GET /api/v1/interviews/{interviewId}/chat
// Response: { errorCode: 0, message: "string", data: [{ id, senderId, sender, content, createdAt }] }
export interface ChatMessage {
  id: number;
  senderId: number;
  sender: string;
  content: string;
  createdAt: string;
}

export async function getChatHistory(interviewId: number): Promise<ChatMessage[]> {
  const res = await request<{ errorCode: number; message: string; data: ChatMessage[] }>(
    `/api/v1/interviews/${interviewId}/chat`,
    {
      method: 'GET',
    }
  );

  return res?.data ?? [];
}

// 면접 메모 조회 API
// GET /api/v1/interviews/{interviewId}/memos
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

export async function getInterviewMemos(interviewId: number): Promise<InterviewMemo[]> {
  const res = await request<{ errorCode: number; message: string; data: InterviewMemo[] }>(
    `/api/v1/interviews/${interviewId}/memos`,
    {
      method: 'GET',
    }
  );

  return res?.data ?? [];
}
