import type { ResumeRecommendation } from '../types/recommendation.types';
import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

export async function fetchRecommendedResumes(
  client: ClientRequestType,
  jdId: number | null,
  limit: number,
  sortType: string
): Promise<ResumeRecommendation[]> {
  const raw = await client.request<ResumeRecommendation[]>(
    `/api/v1/matches/recommendations?jdId=${jdId}&limit=${limit}&sortType=${sortType}`,
    {
      method: 'GET',
    }
  );

  return raw!;
}
