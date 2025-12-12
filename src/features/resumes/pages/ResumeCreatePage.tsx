import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { ResumeData } from '../types/resumes.types';
import BasicInfoForm from '../components/BasicInfoForm';
import ResumeForm from '../components/ResumeForm';
import { createResume } from '../data/resumes.api';
import { getJobDescription } from '../data/jd.api';

// (상단 import 동일)

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
      resume: null,
      portfolio: null,
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

  // 🔹 공고명 로드
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

  // 🔹 draft 복원
  useEffect(() => {
    if (!jdId || isNaN(jdId)) return;

    const raw = localStorage.getItem(DRAFT_KEY(jdId));
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as ResumeData;

      setFormData((prev) => ({
        ...prev,
        ...saved,
        jdId,
        files: {
          ...prev.files,
          ...saved.files,
        },
      }));
    } catch {
      localStorage.removeItem(DRAFT_KEY(jdId));
    }
  }, [jdId]);

  // 🔹 draft 저장
  // 수정된 saveDraft (파일을 건드리지 않음)
  const saveDraft = (next: ResumeData) => {
    if (!jdId || isNaN(jdId)) return;

    const toSave: ResumeData = {
      ...next,
      jdId,
      // ❌ files 안에서 resume/portfolio 를 null로 덮어쓰지 말 것
      files: {
        ...next.files,
        // etc: []  // 이것도 굳이 초기화 안 해도 됨. 필요하면 유지.
      },
    };

    localStorage.setItem(DRAFT_KEY(jdId), JSON.stringify(toSave));
  };

  // 🔹 필드 업데이트 + draft 저장
  const handleChange = <K extends keyof ResumeData>(field: K, value: ResumeData[K]) => {
    setFormData((prev) => {
      const next =
        field === 'files'
          ? ({
              ...prev,
              files: {
                ...prev.files,
                ...(value as ResumeData['files']), // 🔥 files 정확 merge
              },
            } as ResumeData)
          : ({ ...prev, [field]: value } as ResumeData);

      saveDraft(next);
      return next;
    });
  };

  // 🔹 제출
  const handleSubmit = async () => {
    console.log('[SUBMIT] formData.files:', formData.files);

    try {
      const result = await createResume(formData);

      if (jdId && !isNaN(jdId)) {
        localStorage.removeItem(DRAFT_KEY(jdId));
      }

      // File 객체는 location.state로 전달할 수 없으므로 resumeId만 전달
      // ResumeSubmitSuccessPage에서 resumeId로 다시 조회
      navigate('/resume/submit-success', {
        state: {
          resumeId: result.id,
        },
      });
    } catch (e: any) {
      alert('제출 실패: ' + e.message);
    }
  };

  const handlePreview = () => {
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
