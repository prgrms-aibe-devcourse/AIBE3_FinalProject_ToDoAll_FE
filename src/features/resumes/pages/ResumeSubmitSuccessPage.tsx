import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ResumeInfo from '../components/ResumeInfo';
import type { ResumeData } from '../types/resumes.types';

export default function ResumeSubmitSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const jdId = state?.jdId as number | undefined;
  const stateFormData = state?.formData as ResumeData | undefined;

  const [formData, setFormData] = useState<ResumeData | null>(stateFormData ?? null);

  useEffect(() => {
    if (stateFormData) return;

    if (!jdId) return;

    const raw = localStorage.getItem(`resumeDraft:${jdId}`);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as ResumeData;
      setFormData(saved);
    } catch (e) {
      console.error('[ResumeSubmitSuccessPage] draft parse failed', e);
    }
  }, [stateFormData, jdId]);

  const handleClose = () => {
    if (jdId) {
      localStorage.removeItem(`resumeDraft:${jdId}`);
    }
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FAF8F8] p-8">
      <h1 className="mb-4 text-[30px] font-bold text-[#413F3F]">제출 완료!</h1>
      <p className="mb-6 text-[18px] text-[#837C7C]">이력서가 성공적으로 제출되었습니다.</p>

      {formData ? (
        <>
          <div className="w-full max-w-3xl scale-90">
            <ResumeInfo data={formData} />
          </div>

          <button
            onClick={handleClose}
            className="mt-6 rounded-lg bg-[#752F6D] px-6 py-2 text-white hover:bg-[#5E2558]"
          >
            닫기
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-4 text-red-500">이력서 데이터를 불러올 수 없습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="rounded-lg bg-[#752F6D] px-6 py-2 text-white"
          >
            홈으로
          </button>
        </div>
      )}
    </div>
  );
}
