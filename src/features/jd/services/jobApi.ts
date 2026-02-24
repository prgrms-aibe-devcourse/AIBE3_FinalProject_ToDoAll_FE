import type { JobPost, JobStatus } from '../types/JobPost.types';
import type { JobDetail } from '../types/JobDetail.types';
import type { ClientRequestType } from '@shared/hooks/useAuthClient.ts';
export type ApiResponse<T> = {
  errorCode?: number;
  message?: string;
  data?: T;
};

type SpringPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

type JobPostListItemResponse = {
  id: number;
  title: string;
  location: string | null;
  applicantCount: number;
  status: 'OPEN' | 'CLOSED';
  requiredSkills: string[];
  startDate: string; // LocalDate → ISO string로 전달됨
  deadline?: string | null;
  thumbnailUrl?: string | null;
};

export async function fetchJobPosts(
  client: ClientRequestType,
  page = 0,
  size = 10
): Promise<JobPost[]> {
  const res = await client.request<SpringPage<JobPostListItemResponse>>(
    `/api/v1/jd?page=${page}&size=${size}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!res) throw new Error('Empty response');
  return res.content.map((it) => ({
    id: String(it.id),
    title: it.title,
    location: it.location ?? '—(location 미정)—',
    applicantCount: it.applicantCount ?? 0,
    status: it.status,
    skills: it.requiredSkills ?? [],
    postedAt: it.startDate,
    deadline: it.deadline ?? undefined,
    thumbnailUrl: it.thumbnailUrl ?? undefined,
  }));
}

type JobDetailResponse = {
  id: number;
  title: string;
  location?: string | null;
  applicantCount?: number | null;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  skills?: string[];
  preferredSkills?: string[];
  startDate?: string | null;
  deadline?: string | null;
  thumbnailUrl?: string | null;
  description?: string | null;
  benefits?: string[] | string | null;
  experience?: string | null;
  education?: string | null;
  workType?: string | null;
  salary?: string | null;
  department?: string | null;
  images?: string[] | null;
};
const toArray = (v?: string[] | string | null): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map((s) => s.trim());
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};
export async function fetchJobDetail(client: ClientRequestType, id: string): Promise<JobDetail> {
  const res = await client.request<JobDetailResponse>(`/api/v1/jd/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const dto = res!;
  return {
    id: String(dto.id),
    title: dto.title,
    location: dto.location ?? '',
    applicantCount: dto.applicantCount ?? 0,
    status: dto.status,
    skills: dto.skills ?? [],
    postedAt: dto.startDate ?? '',
    deadline: dto.deadline ?? undefined,
    thumbnailUrl:
      dto.thumbnailUrl ??
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop',
    description: dto.description ?? '',
    preferredSkills: dto.preferredSkills ?? [],
    benefits: toArray(dto.benefits),
    experience: dto.experience ?? '',
    education: dto.education ?? '',
    workType: dto.workType ?? '',
    salary: dto.salary ?? '',
    department: dto.department ?? '',
    images: dto.images ?? [],
  };
}

export type JobCreateRequest = {
  title: string;
  department?: string | null;
  workType?: string | null;
  experience?: string | null;
  education?: string | null;
  salary?: string | null;
  description: string | null;
  deadline?: string | null;
  benefits?: string | null;
  location?: string | null;
  thumbnailUrl?: string | null;
  requiredSkills?: string[];
  preferredSkills?: string[];
};

export async function createJobPost(
  client: ClientRequestType,
  request: JobCreateRequest
): Promise<string> {
  const res = await client.request<number>('/api/v1/jd', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: request,
  });

  if (!res) throw new Error('Empty response');
  return String(res);
}

export type Skill = {
  id: number;
  name: string;
};

export async function fetchSkills(client: ClientRequestType): Promise<Skill[]> {
  const res = await client.request<Skill[]>(`/api/v1/jd/skills`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res) {
    throw new Error('Empty skills response');
  }
  return res;
}

export async function updateJobStatus(
  client: ClientRequestType,
  id: string | number,
  status: JobStatus
) {
  const res = await client.request<{ id: number; status: JobStatus }>(
    `/api/v1/jd/${id}/status`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: { status },
    },
    '상태 변경 실패'
  );

  return res!;
}

export async function updateJobPost(
  client: ClientRequestType,
  id: string | number,
  request: JobCreateRequest
): Promise<void> {
  await client.request(
    `/api/v1/jd/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: request,
    },
    '공고 수정 실패'
  );
}

export async function updateJobThumbnail(
  client: ClientRequestType,
  jobId: string,
  thumbnailFile: File
): Promise<string> {
  const formData = new FormData();

  // 💡 백엔드 @RequestPart("thumbnailFile") 이름과 일치
  formData.append('thumbnailFile', thumbnailFile);

  const res = await client.request<string>(
    `/api/v1/jd/${jobId}/thumbnail`,
    {
      method: 'PATCH', // 💡 HTTP 메서드는 PATCH
      body: formData,
    },
    null,
    true
  );

  if (!res) throw new Error('Empty response');
  return res;
}
