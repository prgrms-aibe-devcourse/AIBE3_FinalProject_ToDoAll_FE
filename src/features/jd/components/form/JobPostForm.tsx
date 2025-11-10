import React, { useState } from 'react';
import { Field, Input, TextArea, TagInput } from './fields';

export type JobPostFormValues = {
  title: string;
  department: string;
  workType: string; // 근무 형태
  experience: string;
  location: string;
  postedAt: string; // ISO (시작일)
  deadline?: string; // ISO (마감일)
  education: string;
  salary: string; // 근무 급여/조건
  benefits: string; // 복리후생 (문장)
  description: string; // 업무 설명
  requiredSkills: string[]; // 필수
  preferredSkills: string[]; // 우대
};

export default function JobPostForm({
  defaultValues,
  onSubmit,
  submitting = false,
}: {
  defaultValues?: Partial<JobPostFormValues>;
  // eslint-disable-next-line no-unused-vars
  onSubmit: (values: JobPostFormValues) => void;
  submitting?: boolean;
}) {
  const [values, setValues] = useState<JobPostFormValues>({
    title: '',
    department: '',
    workType: '',
    experience: '',
    location: '',
    postedAt: '',
    deadline: '',
    education: '',
    salary: '',
    benefits: '',
    description: '',
    requiredSkills: [],
    preferredSkills: [],
    ...defaultValues,
  });

  const update = (k: keyof JobPostFormValues, v: any) => setValues((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-5xl rounded-2xl bg-white p-4 sm:p-6 shadow-sm ring-1 ring-gray-200"
    >
      <h2 className="mb-4 text-sm font-semibold text-gray-700">공고 등록</h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Field label="제목">
            <Input
              value={values.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="제목"
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="부서">
            <Input
              value={values.department}
              onChange={(e) => update('department', e.target.value)}
              placeholder="부서"
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="근무 형태">
            <Input
              value={values.workType}
              onChange={(e) => update('workType', e.target.value)}
              placeholder="근무 형태"
            />
          </Field>
        </div>

        <div className="sm:col-span-1">
          <Field label="경력">
            <Input
              value={values.experience}
              onChange={(e) => update('experience', e.target.value)}
              placeholder="경력"
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="시작일">
            <Input
              type="date"
              value={values.postedAt}
              onChange={(e) => update('postedAt', e.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="마감일">
            <Input
              type="date"
              value={values.deadline}
              onChange={(e) => update('deadline', e.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="학력 요건">
            <Input
              value={values.education}
              onChange={(e) => update('education', e.target.value)}
              placeholder="학력 요건"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="근무 급여">
            <Input
              value={values.salary}
              onChange={(e) => update('salary', e.target.value)}
              placeholder="예: 연봉 4,000~6,000만원"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="근무 지역">
            <Input
              value={values.location}
              onChange={(e) => update('location', e.target.value)}
              placeholder="예: 서울 강남구"
            />
          </Field>
        </div>
      </div>

      <div className="mt-3">
        <Field label="복리후생">
          <TextArea
            rows={4}
            value={values.benefits}
            onChange={(e) => update('benefits', e.target.value)}
            placeholder="복리후생을 입력하세요"
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="업무 설명">
          <TextArea
            rows={5}
            value={values.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="담당 업무를 입력하세요"
          />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TagInput
          label="필수 스킬"
          value={values.requiredSkills}
          onChange={(n) => update('requiredSkills', n)}
          placeholder="Enter 또는 , 로 추가"
        />
        <TagInput
          label="우대 스킬"
          value={values.preferredSkills}
          onChange={(n) => update('preferredSkills', n)}
          placeholder="Enter 또는 , 로 추가"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-orange-600 disabled:opacity-60"
        >
          공고 등록
        </button>
      </div>
    </form>
  );
}
