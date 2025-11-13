// JDCreatePage.tsx
import React, { useState } from 'react';
import JobPostForm, { type JobPostFormValues } from '../features/jd/components/form/JobPostForm';
import { createJobPost } from '../features/jd/services/jobApi';

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

const JDCreatePage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);

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
        <JobPostForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </main>
  );
};

export default JDCreatePage;
