import React, { useState } from 'react';
import { Field, Input, TextArea, TagInput } from './fields';

export type JobPostFormValues = {
  title: string;
  department: string;
  workType: string;
  experience: string;
  location: string;
  postedAt: string;
  deadline?: string;
  education: string;
  salary: string;
  benefits: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
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

  const update = <K extends keyof JobPostFormValues>(k: K, v: JobPostFormValues[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => update('title', e.target.value)}
              placeholder="제목"
            />
          </Field>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <Field label="부서">
            <Input
              value={values.department}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('department', e.target.value)
              }
              placeholder="부서"
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="근무 형태">
            <Input
              value={values.workType}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('workType', e.target.value)
              }
              placeholder="근무 형태"
            />
          </Field>
        </div>

        <div className="sm:col-span-1">
          <Field label="경력">
            <Input
              value={values.experience}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('experience', e.target.value)
              }
              placeholder="경력"
            />
          </Field>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
        <div className="sm:col-span-1">
          <Field label="시작일">
            <Input
              type="date"
              value={values.postedAt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('postedAt', e.target.value)
              }
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="마감일">
            <Input
              type="date"
              value={values.deadline}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('deadline', e.target.value)
              }
            />
          </Field>
        </div>
        <div className="sm:col-span-1">
          <Field label="학력 요건">
            <Input
              value={values.education}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('education', e.target.value)
              }
              placeholder="학력 요건"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="근무 급여">
            <Input
              value={values.salary}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('salary', e.target.value)
              }
              placeholder="예: 연봉 4,000~6,000만원"
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="근무 지역">
            <Input
              value={values.location}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                update('location', e.target.value)
              }
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
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              update('benefits', e.target.value)
            }
            placeholder="복리후생을 입력하세요"
          />
        </Field>
      </div>

      <div className="mt-3">
        <Field label="업무 설명">
          <TextArea
            rows={5}
            value={values.description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              update('description', e.target.value)
            }
            placeholder="담당 업무를 입력하세요"
          />
        </Field>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TagInput
          label="필수 스킬"
          value={values.requiredSkills}
          onChange={(next: string[]) => update('requiredSkills', next)}
          placeholder="Enter 또는 , 로 추가"
        />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TagInput
          label="우대 스킬"
          value={values.preferredSkills}
          onChange={(next: string[]) => update('preferredSkills', next)}
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
