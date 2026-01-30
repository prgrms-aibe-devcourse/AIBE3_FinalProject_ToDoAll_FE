import { useEffect, useState } from 'react';
import { fetchJobPosts } from '../features/jd/services/jobApi';
import JobPostList from '../features/jd/components/jobpostlist/JobPostList';
import type { JobPost } from '../features/jd/types/JobPost.types';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@shared/components/PageTitile.tsx';

export default function JDPage() {
  const [items, setItems] = useState<JobPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobPosts().then(setItems);
  }, []);

  return (
    <PageTitle
      title="공고 관리"
      description="등록한 공고를 관리해보세요."
      buttonOnClickFn={() => navigate('/jobs/new')}
    >
      <div className="mx-auto max-w-5xl">
        <JobPostList items={items} />
      </div>
    </PageTitle>
  );
}
