import type { ResumeRecommendation } from '../types/recommendation.types';
import type { MatchCardData } from '../types/matchCardData.types';

export function mapRecommendationToCardData(dto: ResumeRecommendation): MatchCardData {
  return {
    resumeId: dto.resumeId,
    name: dto.name,
    profileImage: dto.profileImage,
    experience: null,
    skills: dto.skills.map((s) => ({ name: s })),
    summary: dto.summary,
    career: [],
    matchScore: dto.matchScore,
  };
}
