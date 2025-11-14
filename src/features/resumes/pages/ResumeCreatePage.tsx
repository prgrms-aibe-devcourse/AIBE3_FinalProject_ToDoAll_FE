import { useState } from 'react';
import type { ResumeData, Skill } from '../types/resumes.types';
import BasicInfoForm from '../components/BasicInfoForm';
import ResumeForm from '../components/ResumeForm';

export default function ResumeCreatePage() {
  const [formData, setFormData] = useState<ResumeData>({
    id: '',
    name: '',
    gender: '남',
    birth: '',
    profileImage: '',
    email: '',
    phone: '',
    applyDate: '',
    address: {
      country: '대한민국',
      city: '',
      detail: '',
    },
    files: { resume: '', portfolio: '', etc: [] },
    education: [],
    career: [],
    skills: [],
    experience: '',
    activities: '',
    certifications: '',
  });

  const handleChange = (
    field: keyof ResumeData,
    value:
      | string
      | boolean
      | string[]
      | Skill[]
      | ResumeData['files']
      | ResumeData['address']
      | '남'
      | '여'
      | ResumeData['education']
      | ResumeData['career']
  ) => {
    setFormData((prev) => {
      switch (field) {
        case 'files':
          return { ...prev, files: value as ResumeData['files'] };
        case 'address':
          return { ...prev, address: value as ResumeData['address'] };
        case 'gender':
          return { ...prev, gender: value as '남' | '여' };
        case 'education':
          return { ...prev, education: value as ResumeData['education'] };
        case 'career':
          return { ...prev, career: value as ResumeData['career'] };
        case 'skills':
          return { ...prev, skills: value as Skill[] };
        default:
          return { ...prev, [field]: value };
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F8]">
      <div className="mx-auto max-w-5xl p-8">
        <h2 className="mb-2 text-center text-[20px] font-light text-[#837C7C]">
          잡다컴퍼니 백엔드 개발자 채용
        </h2>
        <h1 className="mb-8 text-center text-[30px] font-semibold text-[#413F3F]">지원서</h1>

        <h2 className="mb-2 text-[20px] font-medium text-[#413F3F]">
          기본 정보 <span className="mb-3 text-[14px] font-medium text-[#DE4F36]">*필수</span>
        </h2>

        <BasicInfoForm formData={formData} onChange={handleChange} />
        <ResumeForm formData={formData} onChange={handleChange} />
      </div>
    </div>
  );
}
