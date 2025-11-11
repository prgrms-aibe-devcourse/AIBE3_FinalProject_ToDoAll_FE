import { useEffect, useState } from 'react';
import { fetchJobPosts } from '../features/jd/services/jobApi';
import JobPostList from '../features/jd/components/jobpostlist/JobPostList';
import type { JobPost } from '../features/jd/types/JobPost.types';

export default function JDPage() {
  const [items, setItems] = useState<JobPost[]>([]);

  useEffect(() => {
    fetchJobPosts().then(setItems);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">공고 관리</h1>
        <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700">
          공고 등록
        </button>
      </header>

      <div className="mx-auto max-w-5xl">
        <JobPostList
          items={items}
          onOpen={(id) => {
            // 여기서 라우팅 또는 모달 열기 등 연결 예정
            console.log('open job id:', id);
            alert(`공고 상세로 이동: ${id}`);
          }}
        />
      </div>
    </main>
  );
}
