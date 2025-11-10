export interface Interviewer {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export type TabStatus = '전체' | '예정' | '완료' | '진행중';

export type InterviewStatus = '예정' | '진행중' | '합격' | '보류' | '불합격' | '미정';

export const tabToInterviewStatus: Record<TabStatus, InterviewStatus[]> = {
  전체: ['예정', '진행중', '합격', '보류', '불합격', '미정'],
  예정: ['예정'],
  완료: ['합격', '보류', '불합격', '미정'],
  진행중: ['진행중'],
};
