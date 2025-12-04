import { authedRequest } from '@/lib/utils/authedRequest';

type CommonResponse<T> = {
  errorCode: number;
  message: string;
  data: T;
};

export async function endInterview(interviewId: number): Promise<void> {
  await authedRequest<CommonResponse<unknown>>(`/api/v1/interviews/${interviewId}/end`, {
    method: 'PATCH',
  });
}
