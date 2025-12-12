// ResumeForm.tsx
import type { ResumeData, OnResumeChange } from '../types/resumes.types';
import EducationForm from './EducationForm';
import CareerForm from './CareerForm';
import FileUploadForm from './FileUploadForm';
import SkillFormSection from './SkillFormSection';
import ExperienceFormSection from './ExperienceFormSection';
import CertificationFormSection from './CertificationFormSection';

type Props = {
  formData: ResumeData;
  onChange: OnResumeChange;
};

export default function ResumeForm({ formData, onChange }: Props) {
  return (
    <section className="mt-6 space-y-6 rounded-[10px] bg-white p-6 text-[#413F3F] shadow-sm">
      {/* 🔥 resume + portfolio 업로드 모두 여기서 처리 */}
      <FileUploadForm formData={formData} onChange={onChange} />

      <EducationForm formData={formData} onChange={onChange} />
      <CareerForm formData={formData} onChange={onChange} />

      <SkillFormSection
        skills={formData.skills || []}
        onChange={(updated) => onChange('skills', updated)}
      />

      <ExperienceFormSection
        experienceData={formData.activities ? formData.activities.split(',') : []}
        onChange={(updated) => onChange('activities', updated.join(','))}
      />

      <CertificationFormSection
        certData={formData.certifications ? formData.certifications.split(',') : []}
        onChange={(updated) => onChange('certifications', updated.join(','))}
      />
    </section>
  );
}
