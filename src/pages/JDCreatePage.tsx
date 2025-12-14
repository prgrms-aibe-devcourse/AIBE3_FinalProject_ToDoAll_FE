// JDCreatePage.tsx
import React, { useEffect, useState } from 'react';
import JobPostForm, { type JobPostFormValues } from '../features/jd/components/form/JobPostForm';
import { createJobPost, fetchSkills, updateJobThumbnail } from '../features/jd/services/jobApi';
import type { JobCreateRequest } from '../features/jd/services/jobApi';
import { useNavigate } from 'react-router-dom';

type Skill = {
  id: number;
  name: string;
};
const JDCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        setSkills(data);
      } catch (err) {
        console.error('fetchSkills error:', err);
      }
    };
    loadSkills();
  }, []);

  const mapToJobCreateRequest = (
    values: Omit<JobPostFormValues, 'thumbnailFile'>
  ): JobCreateRequest => {
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
      const { thumbnailFile, ...otherValues } = values;
      const baseRequest = mapToJobCreateRequest(otherValues);
      const request = { ...baseRequest, thumbnailUrl: null };
      const jobId = await createJobPost(request);
      if (thumbnailFile instanceof File) {
        await updateJobThumbnail(jobId, thumbnailFile);
      }

      alert('공고가 등록되었습니다.');
      navigate(`/jobs/${jobId}`);
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
          submitLabel="공고 등록"
        />
      </div>
    </main>
  );
};

export default JDCreatePage;
