import type { ResumeData, EducationItem, CareerItem } from '../types/resumes.types';
import TagSection from './TagForm';
import EducationForm from './EducationForm';
import CareerForm from './CareerForm';
import FileUploadForm from './FileUploadForm';

type Props = {
  formData: ResumeData;
  onChange: (
    _field: keyof ResumeData,
    _value:
      | string
      | boolean
      | string[]
      | ResumeData['files']
      | ResumeData['address']
      | '남'
      | '여'
      | EducationItem[]
      | CareerItem[]
  ) => void;
};

export default function ResumeForm({ formData, onChange }: Props) {
  return (
    <section className="mt-6 space-y-6 rounded-[10px] bg-white p-6 text-[#413F3F] shadow-sm">
      <FileUploadForm formData={formData} onChange={onChange} />
      <EducationForm formData={formData} onChange={onChange} />
      <CareerForm formData={formData} onChange={onChange} />

      <TagSection
        title="스킬"
        tags={formData.skills}
        onChange={(updated) => onChange('skills', updated)}
      />
      <TagSection
        title="경험/활동/교육"
        tags={formData.experience ? formData.experience.split(',') : []}
        onChange={(updated) => onChange('experience', updated.join(','))}
      />
      <TagSection
        title="자격/어학/수상"
        tags={formData.certifications ? formData.certifications.split(',') : []}
        onChange={(updated) => onChange('certifications', updated.join(','))}
      />
    </section>
  );
}
