import { request, unwrap } from '../../../lib/utils/base';
import type { PagedResponse } from '../types/pagination.types';
import type { MatchListResponseDto } from '../types/match.types';

export async function fetchAllMatchedResumes(
  jdId: number,
  page: number,
  size: number
): Promise<PagedResponse<MatchListResponseDto>> {
  const raw = await request(`/api/v1/matches?jdId=${jdId}&page=${page}&size=${size}`, {
    method: 'GET',
  });

  return unwrap<PagedResponse<MatchListResponseDto>>(raw);
}
