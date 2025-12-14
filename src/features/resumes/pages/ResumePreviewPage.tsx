import { useLocation, useNavigate } from 'react-router-dom';
import type { ResumeData } from '../types/resumes.types';
import ResumeInfo from '../components/ResumeInfo';

export default function ResumePreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const formData = location.state?.formData as ResumeData | undefined;

  if (!formData) {
    return (
      <div className="flex flex-col items-center p-8">
        <p>미리보기할 이력서 데이터가 없습니다.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 rounded bg-gray-500 px-4 py-2 text-white"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F8] p-8">
      <div className="w-full max-w-3xl scale-90 transform">
        <ResumeInfo data={formData} />
      </div>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 rounded bg-[#752F6D] px-6 py-2 text-white hover:bg-[#5E2558]"
      >
        뒤로가기
      </button>
    </div>
  );
}
