import type { PagedResponse } from '../types/pagination.types';
import type { MatchListResponseDto } from '../types/match.types';
import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';
import { debugLog } from '@lib/utils/debugLog.ts';

export async function fetchAllMatchedResumes(
  client: ClientRequestType,
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

  debugLog('Fetching all matched resumes with params:', { jdId, page, size, sortParam, status });

  const raw = await client.request<PagedResponse<MatchListResponseDto>>(
    `/api/v1/matches?jdId=${jdId}&page=${page}&size=${size}&sort=${sortParam}&status=${status}`,
    {
      method: 'GET',
    }
  );

  return raw!;
}

export async function checkMatch(
  client: ClientRequestType,
  jdId: number,
  resumeId: number
): Promise<string> {
  const raw = await client.request<string>(
    `/api/v1/matches/check?jdId=${jdId}&resumeId=${resumeId}`,
    {
      method: 'GET',
    }
  );

  return raw!;
}
