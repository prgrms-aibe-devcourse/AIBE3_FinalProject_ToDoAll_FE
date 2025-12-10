import { request, unwrap } from '../../../lib/utils/base';
import type { ResumeRecommendation } from '../types/recommendation.types';

export async function fetchRecommendedResumes(
  jdId: number | null,
  limit = 10,
  sortType: string
): Promise<ResumeRecommendation[]> {
  const raw = await request(
    `/api/v1/matches/recommendations?jdId=${jdId}&limit=${limit}&sort=${sortType}`,
    {
      method: 'GET',
    }
  );

  return unwrap<ResumeRecommendation[]>(raw);
}
