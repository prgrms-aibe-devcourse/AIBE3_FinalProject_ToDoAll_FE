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
    <section className="bg-white p-6 space-y-6 mt-6 rounded-[10px] shadow-sm text-[#413F3F]">
      <FileUploadForm formData={formData} onChange={onChange} />
      <EducationForm formData={formData} onChange={onChange} />
      <CareerForm formData={formData} onChange={onChange} />

      <SkillFormSection
        skills={formData.skills || []}
        onChange={(updated) => onChange('skills', updated)}
      />

      <ExperienceFormSection
        experienceData={formData.experience ? formData.experience.split(',') : []}
        onChange={(updated) => onChange('experience', updated.join(','))}
      />

      <CertificationFormSection
        certData={formData.certifications ? formData.certifications.split(',') : []}
        onChange={(updated) => onChange('certifications', updated.join(','))}
      />
    </section>
  );
}
