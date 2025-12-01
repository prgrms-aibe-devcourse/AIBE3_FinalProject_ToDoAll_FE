export interface Interviewer {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export type TabStatus = 'ALL' | 'WAITING' | 'DONE' | 'IN_PROGRESS';

export type InterviewStatus =
  | 'WAITING'
  | 'IN_PROGRESS'
  | 'ACCEPTED'
  | 'ON_HOLD'
  | 'REJECTED'
  | 'DONE';

export const statusLabelMap: Record<InterviewStatus, string> = {
  WAITING: '예정',
  IN_PROGRESS: '진행중',
  ACCEPTED: '합격',
  ON_HOLD: '보류',
  REJECTED: '불합격',
  DONE: '완료',
};

export const tabToInterviewStatus: Record<TabStatus, InterviewStatus[]> = {
  ALL: ['WAITING', 'IN_PROGRESS', 'ACCEPTED', 'ON_HOLD', 'REJECTED', 'DONE'],
  WAITING: ['WAITING'],
  IN_PROGRESS: ['IN_PROGRESS'],
  DONE: ['ACCEPTED', 'ON_HOLD', 'REJECTED', 'DONE'],
};
