export interface MatchListResponseDto {
  resumeId: number;
  resumeName: string;
  resumeProfileImage: string | null;
  matchScore: number;
  status: 'APPLIED' | 'RECOMMENDED' | 'CONFIRMED' | 'BOOKMARK' | 'HOLD' | 'REJECTED';
  skillMatchRate: string;
  missingSkills: string[];
  resumeSummary: string | null;
}

export interface ResumeRecommendation {
  resumeId: number;
  resumeName: string;
  matchScore: number;
  status?: string;
  skillMatchRate?: string;
  missingSkills?: string[];
  resumeSummary?: string | null;
}

export interface MatchResponseDto {
  id: number;
  status: 'APPLIED' | 'RECOMMENDED' | 'CONFIRMED' | 'BOOKMARK' | 'HOLD' | 'REJECTED';
}
