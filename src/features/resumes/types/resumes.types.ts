// src/features/resumes/types/resumes.types.ts

export type Skill = {
  name: string;
  level: '초급' | '중급' | '고급';
};

export type EducationItem = {
  type: string;
  universityType?: string;
  name: string;
  transferred?: boolean;
  major?: string;
  graduated?: boolean;
  startDate?: string;
  endDate?: string;
  dayTime?: 'DAY' | 'NIGHT';
  gpa?: string | number;
  maxGpa?: string | number;
};

export type CareerItem = {
  company: string;
  department: string;
  position: string;
  startDate: string;
  endDate: string;
  job: string;
};

export type ResumeFiles = {
  // ✅ 업로드용
  resume: File | null;
  portfolio: File | null;
  etc: File[];

  // ✅ 조회용(fileKey)
  resumeKey: string;
  portfolioKey: string;

  // ✅ 화면 표시용
  resumeName: string;
  portfolioName: string;
  etcNames: string[];
};

export type ResumeData = {
  id: string;
  jdId: number;
  name: string;
  gender: '남' | '여' | string;
  birth: string;
  profileImage: string;
  email: string;
  phone: string;
  applyDate: string;
  address: { country: string; city: string; detail: string };

  files: ResumeFiles;

  education: EducationItem[];
  career: CareerItem[];
  skills: Skill[];

  experience: string;
  activities: string;
  certifications: string;
  memo: string;
};

export type OnResumeChange = <K extends keyof ResumeData>(_field: K, _value: ResumeData[K]) => void;
