export type ResumeRecommendation = {
  resumeId: number;
  name: string;
  profileImage: string | null;
  gender: string;
  birthDate: string;
  matchScore: number;
  skillMatchRate: string;
  missingSkills: string[];
  summary: string;
  skills: string[];
  status: string;
  recommendationReason: string;
};
