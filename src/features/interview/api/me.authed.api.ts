import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';

export type Me = {
  id: number;
  name?: string;
  nickname?: string;
};

export async function getMeAuthed(client: ClientRequestType): Promise<Me> {
  const raw = await client.request<Me>('/api/v1/users/me', { method: 'GET' });
  return raw!;
}
