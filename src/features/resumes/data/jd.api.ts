export interface JobDescription {
  id: number;
  title: string;
  department: string;
  workType: string;
  experience: string;
  education: string;
  salary: string;
  description: string;
  startDate: string;
  deadline: string;
  status: 'DRAFT' | 'OPEN' | 'CLOSED';
  benefits: string[];
  applicantCount: number;
  location: string;
  thumbnailUrl: string;
  skills: string[];
  preferredSkills: string[];
}

export type ApiResponse<T> = {
  errorCode?: number;
  message?: string;
  data?: T;
};

const toArray = (v?: string[] | string | null): string[] => {
  if (!v) return [];
  if (Array.isArray(v)) return v.filter(Boolean).map((s) => s.trim());
  return v
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
};

export async function getJobDescription(id: number): Promise<JobDescription> {
  const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
  const res = await fetch(`${BASE_URL}/api/v1/jd/${id}`);

  if (!res.ok) {
    throw new Error(`공고 정보를 불러올 수 없습니다. (HTTP ${res.status})`);
  }

  const body = (await res.json()) as ApiResponse<JobDescription>;

  if (!body.data) {
    throw new Error(body.message ?? 'Empty response');
  }

  const dto = body.data;

  return {
    id: dto.id,
    title: dto.title,
    department: dto.department,
    workType: dto.workType,
    experience: dto.experience,
    education: dto.education,
    salary: dto.salary,
    description: dto.description,
    startDate: dto.startDate,
    deadline: dto.deadline,
    status: dto.status,
    benefits: toArray(dto.benefits),
    applicantCount: dto.applicantCount,
    location: dto.location,
    thumbnailUrl: dto.thumbnailUrl,
    skills: dto.skills ?? [],
    preferredSkills: dto.preferredSkills ?? [],
  };
}
