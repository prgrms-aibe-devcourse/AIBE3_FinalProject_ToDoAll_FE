export interface MatchListResponseDto {
  resumeId: number;
  resumeName: string;
  matchScore: number;
  status: string;
  skillMatchRate: string;
  missingSkills: string[];
  resumeSummary: string | null;
}
