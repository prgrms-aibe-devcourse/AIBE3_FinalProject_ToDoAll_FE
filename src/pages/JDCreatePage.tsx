// JDCreatePage.tsx
import React, { useEffect, useState } from 'react';
import JobPostForm, { type JobPostFormValues } from '../features/jd/components/form/JobPostForm';
import { createJobPost, type ApiResponse } from '../features/jd/services/jobApi';
// import type ApiResponse from '../features/jd/services/jobApi';

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
type Skill = {
  id: number;
  name: string;
};
const JDCreatePage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/v1/jd/skills');
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const body = (await res.json()) as ApiResponse<Skill[]>;
        if (body.data) {
          setSkills(body.data);
        } else {
          console.warn('skills empty:', body.message);
        }
      } catch (err) {
        console.error('스킬 목록 조회 실패:', err);
      }
    };
    fetchSkills();
  }, []);

  // TODO: 나중에 로그인 붙으면 실제 로그인 유저의 ID로 교체
  const authorId = 1;
  const mapToJobCreateRequest = (values: JobPostFormValues): JobCreateRequest => {
    const emptyToNull = (v?: string): string | null => (v && v.trim().length > 0 ? v : null);

    return {
      title: values.title,
      department: emptyToNull(values.department),
      workType: emptyToNull(values.workType),
      experience: emptyToNull(values.experience),
      education: emptyToNull(values.education),
      salary: emptyToNull(values.salary),
      description: emptyToNull(values.description),
      deadline: values.deadline && values.deadline.length > 0 ? values.deadline : null,
      benefits: emptyToNull(values.benefits),
      location: emptyToNull(values.location),
      thumbnailUrl: null,
      authorId,
      requiredSkills: values.requiredSkills ?? [],
      preferredSkills: values.preferredSkills ?? [],
    };
  };

  const handleSubmit = async (values: JobPostFormValues) => {
    try {
      setSubmitting(true);
      const normalize = (s: string) => s.trim().toLowerCase();
      const knownSkillNames = new Set(skills.map((s) => normalize(s.name)));

      const unknownRequired = (values.requiredSkills ?? []).filter(
        (name) => !knownSkillNames.has(normalize(name))
      );
      const unknownPreferred = (values.preferredSkills ?? []).filter(
        (name) => !knownSkillNames.has(normalize(name))
      );

      if (unknownRequired.length > 0 || unknownPreferred.length > 0) {
        alert(
          [
            '등록되지 않은 스킬이 있습니다.',
            '',
            `필수 스킬: ${unknownRequired.length ? unknownRequired.join(', ') : '-'}`,
            `우대 스킬: ${unknownPreferred.length ? unknownPreferred.join(', ') : '-'}`,
            '',
            '관리자에게 해당 스킬을 마스터에 등록 요청한 후 다시 시도해주세요.',
          ].join('\n')
        );
        return;
      }

      const request = mapToJobCreateRequest(values);
      const id = await createJobPost(request);

      alert(`공고가 등록되었습니다. ID: ${id}`);
    } catch (error) {
      console.error('createJobPost error:', error);
      alert('공고 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-xl font-semibold text-gray-800">채용 공고 등록</h1>
        <JobPostForm
          onSubmit={handleSubmit}
          submitting={submitting}
          skillOptions={skills.map((s) => s.name)}
        />
      </div>
    </main>
  );
};

export default JDCreatePage;
