import type { JobDetail } from '../features/jd/types/JobDetail.types';
import JobDetailView from '../features/jd/components/detail/JobDetailView';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchJobDetail } from '../features/jd/services/jobApi';

export default function JDDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<JobDetail | null>(null);
  useEffect(() => {
    if (!id) return;
    fetchJobDetail(id).then(setData);
  }, [id]);
  if (!data) return <p className="p-4">불러오는 중입니다…</p>;
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold">공고 관리</h1>
      </div>
      <JobDetailView job={data} onEdit={() => alert('정보 변경')} />
    </main>
  );
}
