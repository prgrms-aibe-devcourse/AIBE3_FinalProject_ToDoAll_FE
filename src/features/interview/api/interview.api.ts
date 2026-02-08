import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

export async function endInterview(client: ClientRequestType, interviewId: number): Promise<void> {
  await client.request(`/api/v1/interviews/${interviewId}/end`, {
    method: 'PATCH',
  });
}
