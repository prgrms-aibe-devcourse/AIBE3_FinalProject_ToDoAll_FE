import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getResume } from '../data/resumes.api';
import type { ResumeData } from '../types/resumes.types';
import ApplicantStatus from '../components/ApplicantStatus';
import ApplicantInfo from '../components/ApplicantInfo';
import ResumeMemo from '../components/ResumeMemo';
import ResumeInfo from '../components/ResumeInfo';

export default function ResumeDetail() {
  const { resumeId } = useParams<{ resumeId: string }>();
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('resumeId:', resumeId);
    if (!resumeId) return;

    async function fetchResume() {
      try {
        const data = await getResume(resumeId!);
        console.log('받은 데이터:', data);
        setResume(data);
      } catch (err: any) {
        setError(err.message || '이력서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchResume();
  }, [resumeId]);

  if (loading) return <p className="p-8">이력서를 불러오는 중...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!resume) return <p className="p-8">이력서 데이터가 없습니다.</p>;

  return (
    <section className="flex flex-col bg-[#FAF8F8] sm:h-screen sm:flex-row">
      <aside className="p-4">
        <ApplicantStatus data={resume} />
        <ApplicantInfo
          data={{
            email: resume.email,
            phone: resume.phone,
            applyDate: resume.applyDate,
          }}
        />
        <ResumeMemo resumeId={resume.id} initialMemo={resume.memo} />
      </aside>

      <section className="w-full p-8 sm:overflow-y-auto">
        <ResumeInfo data={resume} />
      </section>
    </section>
  );
}
