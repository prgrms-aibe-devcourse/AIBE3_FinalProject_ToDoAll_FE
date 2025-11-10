export type ResumeData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  applyDate: string;
  birth: string;
  address: string;
  profileImage: string;
  education: string;
  experience: string;
  activities?: string;
  certifications?: string;
  skills: string[];
  files: {
    resume: string;
    portfolio: string;
  };
};
