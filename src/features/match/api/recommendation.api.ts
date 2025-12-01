import { request, unwrap } from '../../../lib/utils/base';
import type { ResumeRecommendation } from '../types/recommendation.types';

export async function fetchRecommendedResumes(jdId: number): Promise<ResumeRecommendation[]> {
  const raw = await request(`/api/v1/matches/recommendations?jdId=${jdId}`, {
    method: 'GET',
  });

  return unwrap<ResumeRecommendation[]>(raw);
}
