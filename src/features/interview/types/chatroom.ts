export const MessageType = {
  CHAT: 'CHAT',
  NOTE: 'NOTE',
  SYSTEM: 'SYSTEM',
} as const;

export type MessageTypeValue = (typeof MessageType)[keyof typeof MessageType];

export interface OutgoingChatMessage {
  type: typeof MessageType.CHAT;
  interviewId: number;
  senderId: number;
  sender: string;
  content: string;
}

export interface QuestionSection {
  topic: string;
  questions: string[];
}

export interface InterviewSummary {
  id: number;
  authorId: number;
  title: string;
  content: string;
}
