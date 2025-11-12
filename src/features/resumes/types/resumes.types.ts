export type Address = {
  country: string;
  city: string;
  detail: string;
};

export type Skill = {
  name: string;
  level: '초급' | '중급' | '고급';
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

export type CareerItem = {
  company: string;
  startDate: string;
  endDate: string;
  position: string;
  department: string;
  job: string;
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
  career?: CareerItem[];
  skills: Skill[];
  experience: string;
  activities: string;
  certifications: string;
};

// Generic onChange handler type that maps a ResumeData key to its value type.
// Using underscore-prefixed param names to satisfy ESLint's unused-vars rule in type positions.
export type OnResumeChange = <K extends keyof ResumeData>(_field: K, _value: ResumeData[K]) => void;
