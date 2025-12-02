import { request, unwrap } from '../../../lib/utils/base';
import type { ResumeRecommendation } from '../types/recommendation.types';

export async function fetchRecommendedResumes(
  jdId: number,
  limit = 10
): Promise<ResumeRecommendation[]> {
  const raw = await request(`/api/v1/matches/recommendations?jdId=${jdId}&limit=${limit}`, {
    method: 'GET',
  });

  return unwrap<ResumeRecommendation[]>(raw);
}
