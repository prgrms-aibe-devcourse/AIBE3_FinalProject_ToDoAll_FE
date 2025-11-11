import type { JobPost } from '../types/JobPost.types';

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
  const data = (await res.json()) as { content: JobPostListItemResponse[] };
  console.log('Fetched job posts:', data);
  return data.content.map((it) => ({
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
