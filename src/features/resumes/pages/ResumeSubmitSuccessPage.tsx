import { useLocation, useNavigate } from 'react-router-dom';
import ResumeInfo from '../components/ResumeInfo';
import type { ResumeData } from '../types/resumes.types';

export default function ResumeSubmitSuccessPage() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const formData = state?.formData as ResumeData | undefined;

  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FAF8F8] p-8">
      <h1 className="mb-4 text-[30px] font-bold text-[#413F3F]">제출 완료!</h1>
      <p className="mb-6 text-[18px] text-[#837C7C]">이력서가 성공적으로 제출되었습니다.</p>

      {formData ? (
        <div className="w-full max-w-4xl">
          <ResumeInfo data={formData} />
        </div>
      ) : (
        <p>이력서 데이터를 불러올 수 없습니다.</p>
      )}

      <button
        onClick={() => navigate('/')}
        className="mt-8 rounded-lg bg-[#752F6D] px-6 py-3 text-white hover:bg-[#5E2558]"
      >
        닫기
      </button>
    </div>
  );
}
