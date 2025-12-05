export interface Interviewer {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export type TabStatus = 'ALL' | 'WAITING' | 'DONE' | 'IN_PROGRESS';

export type InterviewStatus = 'WAITING' | 'IN_PROGRESS' | 'DONE';

export type ResultStatus = 'PASS' | 'HOLD' | 'FAIL' | 'PENDING';

export const statusLabelMap: Record<InterviewStatus, string> = {
  WAITING: '예정',
  IN_PROGRESS: '진행중',
  DONE: '완료',
};

export const resultStatusLabelMap: Record<ResultStatus, string> = {
  PASS: '합격',
  HOLD: '보류',
  FAIL: '불합격',
  PENDING: '미정',
};

export const tabToInterviewStatus: Record<TabStatus, InterviewStatus[]> = {
  ALL: ['WAITING', 'IN_PROGRESS', 'DONE'],
  WAITING: ['WAITING'],
  IN_PROGRESS: ['IN_PROGRESS'],
  DONE: ['DONE'],
};
