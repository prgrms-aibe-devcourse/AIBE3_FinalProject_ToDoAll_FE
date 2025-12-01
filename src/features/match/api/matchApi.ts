import { request, unwrap } from '../../../lib/utils/base';
import type { MatchListResponseDto } from '../types/match.types';

export async function fetchAllMatchedResumes(
  jdId: number,
  status?: string,
  page = 0,
  size = 20
): Promise<MatchListResponseDto[]> {
  const params = new URLSearchParams({
    jdId: jdId.toString(),
    page: page.toString(),
    size: size.toString(),
  });
  if (status) params.append('status', status);

  const raw = await request(`/api/v1/matches?${params.toString()}`, {
    method: 'GET',
  });
  const paged = unwrap<{ content: MatchListResponseDto[] }>(raw);
  return paged.content;
}
