import { authedRequest } from '@/lib/utils/authedRequest';

type CommonResponse<T> = {
  message: string;
  data: T;
};

export type UserProfile = {
  id: number;
  name?: string;
  nickname?: string;
  profileUrl?: string;
};

export type ResumeProfile = {
  id: number;
  resumeFileUrl?: string;
};

export async function getUserProfileAuthed(userId: number): Promise<UserProfile> {
  const raw = await authedRequest<CommonResponse<UserProfile>>(`/api/v1/users/${userId}`, {
    method: 'GET',
  });
  return raw.data;
}

export async function getResumeAuthed(resumeId: number): Promise<ResumeProfile> {
  const raw = await authedRequest<CommonResponse<ResumeProfile>>(`/api/v1/resumes/${resumeId}`, {
    method: 'GET',
  });
  return raw.data;
}
