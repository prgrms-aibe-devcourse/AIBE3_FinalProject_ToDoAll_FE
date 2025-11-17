import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { ResumeData } from '../types/resumes.types';
import BasicInfoForm from '../components/BasicInfoForm';
import ResumeForm from '../components/ResumeForm';
import { createResume } from '../data/resumes.api';
import { getJobDescription } from '../data/jd.api';

export default function ResumeCreatePage() {
  const { id } = useParams();
  const jdId = Number(id);

  const [jobTitle, setJobTitle] = useState('');
  const [formData, setFormData] = useState<ResumeData>({
    id: '',
    jdId: jdId, // URL에서 받은 id를 기본값으로 넣어줌
    name: '',
    gender: '남',
    birth: '',
    profileImage: '',
    email: '',
    phone: '',
    applyDate: '',
    address: { country: '대한민국', city: '', detail: '' },
    files: { resume: '', portfolio: '', etc: [] },
    education: [],
    career: [],
    skills: [],
    experience: '',
    activities: '',
    certifications: '',
  });

  useEffect(() => {
    async function fetchJD() {
      if (!jdId || isNaN(jdId)) {
        console.error('유효하지 않은 공고 ID입니다.');
        return;
      }
      try {
        const jd = await getJobDescription(jdId);
        setJobTitle(jd.title);
      } catch (e) {
        console.error(e);
      }
    }
    fetchJD();
  }, [jdId]);

  const handleChange = (field: keyof ResumeData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const result = await createResume(formData);
      alert('제출 성공! 이력서 ID = ' + result.id);
    } catch (e: any) {
      alert('제출 실패: ' + e.message);
    }
  };

  if (!jdId || isNaN(jdId)) {
    return <p>유효하지 않은 공고 ID입니다.</p>;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F8]">
      <div className="mx-auto max-w-5xl p-8">
        <h2 className="mb-2 text-center text-[20px] font-light text-[#837C7C]">
          {jobTitle || '공고 불러오는 중...'}
        </h2>
        <h1 className="mb-8 text-center text-[30px] font-semibold text-[#413F3F]">지원서</h1>

        <h2 className="mb-2 text-[20px] font-medium text-[#413F3F]">
          기본 정보 <span className="mb-3 text-[14px] font-medium text-[#DE4F36]">*필수</span>
        </h2>

        <BasicInfoForm formData={formData} onChange={handleChange} />
        <ResumeForm formData={formData} onChange={handleChange} />

        <div className="mt-8 flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#837C7C] px-5 py-3 text-[#faf8f8] hover:bg-[#6E6767]"
          >
            저장하기
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#752F6D] px-5 py-3 text-[#faf8f8] hover:bg-[#5E2558]"
          >
            제출하기
          </button>
        </div>
      </div>
    </div>
  );
}
