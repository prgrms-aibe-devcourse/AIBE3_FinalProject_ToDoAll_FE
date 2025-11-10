export type Address = {
  country: string;
  city: string;
  detail: string;
};

export type EducationItem =
  | {
      type: '초등학교' | '중학교' | '고등학교';
      name: string;
      graduated: boolean;
      startDate: string;
      endDate: string;
    }
  | {
      type: '대학' | '대학원';
      universityType: string;
      name: string;
      transferred: boolean;
      major: string;
      graduated: boolean;
      startDate: string;
      endDate: string;
      dayTime: '주간' | '야간';
      gpa?: number;
    };
// src/features/resumes/types/resumes.types.ts

export type CareerItem = {
  company: string;
  startDate: string;
  endDate: string;
  position: string; // 직급/직책
  department: string; // 근무부서
  job: string; // 직무
};

export type ResumeData = {
  id: string;
  name: string;
  gender: '남' | '여';
  birth: string;
  profileImage: string;
  email: string;
  phone: string;
  applyDate: string;
  address: Address;
  files: {
    resume: string;
    portfolio: string;
    etc?: string[];
  };
  education: EducationItem[];
  career?: CareerItem[]; // ← 추가
  skills: string[];
  experience: string;
  activities: string;
  certifications: string;
};
