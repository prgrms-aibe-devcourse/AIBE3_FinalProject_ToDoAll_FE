import type { JobDetail } from '../features/jd/types/JobDetail.types';
import JobDetailView from '../features/jd/components/detail/JobDetailView';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchJobDetail } from '../features/jd/services/jobApi';
import { Link } from 'react-router-dom';
import { useAuthedClient } from '@shared/hooks/useAuthClient.ts';

export default function JDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<JobDetail | null>(null);
  const navigate = useNavigate();
  const client = useAuthedClient();

  useEffect(() => {
    if (!id) return;
    fetchJobDetail(client, id).then(setData);
  }, [client, id]);
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/jobs/${id}/apply`;
    try {
      await navigator.clipboard.writeText(url);
      alert('지원 링크가 클립보드에 복사되었습니다.');
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      window.prompt('아래 링크를 복사해서 사용하세요.', url);
    }
  };
  if (!data) return <p className="p-4">불러오는 중입니다…</p>;
  return (
    <section className="flex min-h-screen flex-col items-center bg-[#fff7f0] bg-gray-50 p-4 sm:p-6">
      <div className="mb-3 flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold">공고 관리</h1>
        <button
          className="rounded-full bg-orange-500 px-3 py-1.5 text-sm text-white shadow hover:bg-orange-600"
          onClick={handleCopyLink}
        >
          지원 링크 발급
        </button>
      </div>
      <section className="gap flex w-fit flex-col gap-4">
        <JobDetailView job={data} onEdit={() => navigate(`/jobs/${id}/update`)} />
        <Link
          to={`/matches`}
          state={{ jdId: Number(id) }}
          className="w-fit rounded bg-[#752F6D] px-4 py-2 text-white transition hover:bg-[#9A3F90]"
        >
          지원자 관리
        </Link>
      </section>
    </section>
  );
}
