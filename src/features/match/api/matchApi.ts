import { request, unwrap } from '../../../lib/utils/base';
import type { PagedResponse } from '../types/pagination.types';
import type { MatchListResponseDto } from '../types/match.types';

export async function fetchAllMatchedResumes(
  jdId: number | null,
  page: number,
  size: number,
  sortType: string,
  status: string
): Promise<PagedResponse<MatchListResponseDto>> {
  const sortMap: Record<string, string> = {
    LATEST: 'appliedAt,desc',
    SCORE_DESC: 'matchScore,desc',
  };

  const sortParam = sortMap[sortType] ?? 'createdAt,desc'; // fallback

  console.log('Fetching all matched resumes with params:', { jdId, page, size, sortParam, status });
  const raw = await request(
    `/api/v1/matches?jdId=${jdId}&page=${page}&size=${size}&sort=${sortParam}&status=${status}`,
    {
      method: 'GET',
    }
  );

  return unwrap<PagedResponse<MatchListResponseDto>>(raw);
}

export async function checkMatch(jdId: number, resumeId: number): Promise<string> {
  const raw = await request(`/api/v1/matches/check?jdId=${jdId}&resumeId=${resumeId}`, {
    method: 'GET',
  });
  return unwrap<string>(raw);
}
