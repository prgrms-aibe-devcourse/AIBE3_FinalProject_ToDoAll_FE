import type { MatchListResponseDto } from '../types/match.types';
import type { MatchCardData } from '../types/matchCardData.types';

export const mapMatchDtoToCardData = (dto: MatchListResponseDto): MatchCardData => {
  return {
    resumeId: dto.resumeId,
    name: dto.resumeName,
    profileImage: dto.resumeProfileImage,
    experience: null,
    skills: [],
    summary: dto.resumeSummary,
    career: [],
    matchScore: dto.matchScore,
    status: dto.status,
    skillMatchRate: dto.skillMatchRate,
  };
};
