export interface Message {
  id: number;
  text: string;
  isMine: boolean;
}

export interface QuestionSection {
  topic: string;
  questions: string[];
}

export interface InterviewSummary {
  title: string;
  content: string;
}
