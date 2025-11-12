export type JobStatus = 'OPEN' | 'CLOSED' | 'DRAFT';

export interface JobPost {
  id: string;
  title: string;
  location: string;
  applicantCount: number;
  status: JobStatus;
  skills: string[];
  thumbnailUrl?: string;
  postedAt: string;
  deadline?: string;
}
/* eslint-disable-next-line no-unused-vars */
export type OpenHandler = (id: string | number) => void;
