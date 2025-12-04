import { authedRequest } from '@/lib/utils/authedRequest';

type CommonResponse<T> = {
  errorCode: number;
  message: string;
  data: T;
};

export type Me = {
  id: number;
  name?: string;
  nickname?: string;
};

export async function getMeAuthed(): Promise<Me> {
  const raw = await authedRequest<CommonResponse<Me>>('/api/v1/users/me', { method: 'GET' });
  return raw.data;
}
