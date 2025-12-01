export type MatchCardData = {
  resumeId: number;
  name: string;
  profileImage: string | null;
  experience: string | null;
  skills: { name: string }[];
  summary: string | null;
  career: { company: string; position: string; department: string }[];
  matchScore: number;
};
