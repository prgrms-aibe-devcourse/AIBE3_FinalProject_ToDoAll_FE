import type { JobPost } from '../types/JobPost.types';
import type { JobDetail } from '../types/JobDetail.types';

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

export async function fetchJobPosts(page = 0, size = 10): Promise<JobPost[]> {
  const res = await fetch(`http://localhost:8080/api/v1/jd?page=${page}&size=${size}`);
  const body = (await res.json()) as ApiResponse<SpringPage<JobPostListItemResponse>>;
  if (!body.data) throw new Error(body.message ?? 'Empty response');
  return body.data.content.map((it) => ({
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
export async function fetchJobDetail(id: string): Promise<JobDetail> {
  const res = await fetch(`http://localhost:8080/api/v1/jd/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as ApiResponse<JobDetailResponse>;
  const dto = body.data!;
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

type JobCreateRequest = {
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
  authorId: number;
  requiredSkills?: string[];
  preferredSkills?: string[];
};

export async function createJobPost(request: JobCreateRequest): Promise<string> {
  const res = await fetch(`http://localhost:8080/api/v1/jd`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as ApiResponse<number>;
  if (!body.data) throw new Error(body.message ?? 'Empty response');
  return String(body.data);
}
