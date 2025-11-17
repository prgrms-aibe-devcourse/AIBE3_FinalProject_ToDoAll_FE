import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import JobPostForm, { type JobPostFormValues } from '../features/jd/components/form/JobPostForm';
import {
  fetchSkills,
  fetchJobDetail,
  updateJobPost,
  type JobCreateRequest,
} from '../features/jd/services/jobApi';

type Skill = {
  id: number;
  name: string;
};

const JDEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [initialValues, setInitialValues] = useState<JobPostFormValues | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [skillsRes, job] = await Promise.all([fetchSkills(), fetchJobDetail(id as string)]);
        setSkills(skillsRes);

        setInitialValues({
          title: job.title,
          department: job.department || '',
          workType: job.workType || '',
          experience: job.experience || '',
          education: job.education || '',
          salary: job.salary || '',
          description: job.description || '',
          deadline: job.deadline || '',
          benefits: job.benefits ? job.benefits.join(', ') : '',
          location: job.location || '',
          requiredSkills: job.skills ?? [],
          preferredSkills: job.preferredSkills ?? [],
          postedAt: job.postedAt || '',
        });
      } catch (err) {
        console.error('JDEditPage load error:', err);
        alert('공고 정보를 불러오는 중 오류가 발생했습니다.');
      }
    };

    if (id) load();
  }, [id]);

  const mapToJobUpdateRequest = (values: JobPostFormValues): JobCreateRequest => {
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
      thumbnailUrl: null, // 아직 업로드 안 붙였으면 그대로
      authorId: 1, // TODO: 로그인 붙으면 교체
      requiredSkills: values.requiredSkills ?? [],
      preferredSkills: values.preferredSkills ?? [],
    };
  };

  const handleSubmit = async (values: JobPostFormValues) => {
    if (!id) return;

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

      const request = mapToJobUpdateRequest(values);
      await updateJobPost(id, request);

      alert('공고가 수정되었습니다.');
      // 필요하면 상세 페이지로 이동 등
    } catch (error) {
      console.error('updateJobPost error:', error);
      alert('공고 수정 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!initialValues) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-5xl">로딩 중...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-4 text-xl font-semibold text-gray-800">채용 공고 수정</h1>
        <JobPostForm
          onSubmit={handleSubmit}
          submitting={submitting}
          skillOptions={skills.map((s) => s.name)}
          defaultValues={initialValues}
          submitLabel="공고 수정"
        />
      </div>
    </main>
  );
};

export default JDEditPage;
