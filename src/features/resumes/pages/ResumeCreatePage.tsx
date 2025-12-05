// src/features/resumes/pages/ResumeCreatePage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ResumeData } from '../types/resumes.types';
import BasicInfoForm from '../components/BasicInfoForm';
import ResumeForm from '../components/ResumeForm';
import { createResume } from '../data/resumes.api';
import { getJobDescription } from '../data/jd.api';

const DRAFT_KEY = (jdId: number) => `resumeDraft:${jdId}`;

export default function ResumeCreatePage() {
  const { id } = useParams();
  const jdId = Number(id);
  const navigate = useNavigate();

  const [jobTitle, setJobTitle] = useState('');
  const [formData, setFormData] = useState<ResumeData>({
    id: '',
    jdId,
    name: '',
    gender: '남',
    birth: '',
    profileImage: '',
    email: '',
    phone: '',
    applyDate: '',
    address: { country: '대한민국', city: '', detail: '' },

    files: {
      resume: null, // (다른 곳에서 연결)
      portfolio: null, // FileUploadForm에서 연결
      etc: [],
      resumeKey: '',
      portfolioKey: '',
      resumeName: '',
      portfolioName: '',
      etcNames: [],
    },

    education: [],
    career: [],
    skills: [],
    experience: '',
    activities: '',
    certifications: '',
    memo: '',
  });

  // ✅ 공고명 불러오기
  useEffect(() => {
    async function fetchJD() {
      if (!jdId || isNaN(jdId)) return;
      try {
        const jd = await getJobDescription(jdId);
        setJobTitle(jd.title);
      } catch (e) {
        console.error(e);
      }
    }
    fetchJD();
  }, [jdId]);

  // ✅ 페이지 진입 시 draft 복원
  useEffect(() => {
    if (!jdId || isNaN(jdId)) return;

    const raw = localStorage.getItem(DRAFT_KEY(jdId));
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as ResumeData;

      // File은 직렬화 불가 -> null로 복원 (텍스트/리스트만 복원)
      setFormData((prev) => ({
        ...prev,
        ...saved,
        jdId,
        files: {
          ...prev.files,
          ...saved.files,
          resume: null,
          portfolio: null,
          etc: [],
        },
      }));
    } catch {
      localStorage.removeItem(DRAFT_KEY(jdId));
    }
  }, [jdId]);

  const saveDraft = (next: ResumeData) => {
    if (!jdId || isNaN(jdId)) return;

    const toSave: ResumeData = {
      ...next,
      jdId,
      files: {
        ...next.files,
        // File 객체는 저장 불가라 null 처리
        resume: null,
        portfolio: null,
        etc: [],
      },
    };

    localStorage.setItem(DRAFT_KEY(jdId), JSON.stringify(toSave));
  };

  // ✅ 입력 변경 시: state 업데이트 + 즉시 draft 저장
  const handleChange = (field: keyof ResumeData, value: any) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      saveDraft(next);
      return next;
    });
  };

  const handleSubmit = async () => {
    try {
      const result = await createResume(formData);

      // ✅ 제출 성공하면 draft 삭제
      if (jdId && !isNaN(jdId)) {
        localStorage.removeItem(DRAFT_KEY(jdId));
      }

      navigate('/resume/submit-success', {
        state: {
          resumeId: result.id,
          formData,
        },
      });
    } catch (e: any) {
      alert('제출 실패: ' + e.message);
    }
  };

  const handlePreview = () => {
    // (선택) 디버그
    // console.log('[Create] before preview draft=', localStorage.getItem(DRAFT_KEY(jdId)));
    navigate('/resume/preview', { state: { formData } });
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
            onClick={handlePreview}
            className="rounded-lg bg-[#837C7C] px-5 py-3 text-[#faf8f8] hover:bg-[#6E6767]"
          >
            미리보기
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg bg-[#752F6D] px-5 py-3 text-[#faf8f8] hover:bg-[#5E2558]"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
