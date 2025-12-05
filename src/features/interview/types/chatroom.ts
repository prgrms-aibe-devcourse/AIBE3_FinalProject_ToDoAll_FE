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

export interface QuestionItem {
  id: number;
  content: string;
  checked: boolean;
}

export interface QuestionSection {
  topic: string;
  questions: QuestionItem[];
}

export interface InterviewSummary {
  id: number;
  authorId: number;
  title: string;
  content: string;
}

export interface IncomingNoteMessage {
  type: typeof MessageType.NOTE;
  interviewId: number;
  senderId: number;
  sender: string;
  content: string;
  noteId?: number;
}
