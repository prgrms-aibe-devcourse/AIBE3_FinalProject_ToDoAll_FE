import type { ResumeRecommendation } from '../types/recommendation.types';
import type { ResumeData } from '../../resumes/types/resumes.types';

export function mapRecommendationToResumeData(rec: ResumeRecommendation): ResumeData & {
  summary: string;
  matchScore: number;
} {
  return {
    id: rec.resumeId.toString(),
    jdId: 0,
    name: rec.name,
    gender: rec.gender as '남' | '여',
    birth: rec.birthDate,
    profileImage: '',
    email: '',
    phone: '',
    applyDate: new Date().toISOString(),
    address: { country: '', city: '', detail: '' },
    files: { resume: '', portfolio: '' },

    education: [],
    career: [],
    activities: '',
    certifications: '',
    memo: '',

    skills: rec.skills.map((s) => ({
      name: s,
      level: '중급',
    })),

    experience: '',
    summary: rec.summary,
    matchScore: rec.matchScore,
  };
}
