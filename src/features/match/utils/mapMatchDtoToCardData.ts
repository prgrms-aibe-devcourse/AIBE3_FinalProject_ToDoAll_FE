import type { MatchListResponseDto } from '../types/match.types';
import type { MatchCardData } from '../types/matchCardData.types';

export function mapMatchDtoToCardData(dto: MatchListResponseDto): MatchCardData {
  return {
    resumeId: dto.resumeId,
    name: dto.resumeName,
    profileImage: null,
    experience: null,
    skills: [],
    summary: dto.resumeSummary ?? null,
    career: [],
    matchScore: dto.matchScore ?? 0,
  };
}
