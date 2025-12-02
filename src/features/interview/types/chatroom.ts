export interface Message {
  id: number;
  text: string;
  senderId: number;
  isMine: boolean;
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
