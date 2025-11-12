import type { JobPost } from './JobPost.types';

export type EmploymentType = '정규직' | '계약직' | '인턴' | '자율';
export interface JobDetail extends JobPost {
  description: string; // 업무 설명
  preferredSkills?: string[]; // 우대 스킬
  benefits?: string[]; // 복리후생
  experience?: string; // 경력
  education?: string; // 학력
  workType?: string; // 근무 형태 (예: 재택 근무)
  salary?: string; // 연봉
  department?: string; // 소속 부서
  images?: string[]; // 미디어 갤러리
}
