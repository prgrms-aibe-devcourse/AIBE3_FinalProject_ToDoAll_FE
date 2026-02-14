import { useEffect, useState } from 'react';
import { fetchJobPosts } from '../features/jd/services/jobApi';
import JobPostList from '../features/jd/components/jobpostlist/JobPostList';
import type { JobPost } from '../features/jd/types/JobPost.types';
import { useNavigate } from 'react-router-dom';
import PageTitle from '@shared/components/PageTitile.tsx';
import { useAuthedClient } from '@shared/hooks/useAuthClient.ts';

export default function JDPage() {
  const [items, setItems] = useState<JobPost[]>([]);
  const navigate = useNavigate();
  const client = useAuthedClient();

  useEffect(() => {
    fetchJobPosts(client).then(setItems);
  }, [client]);

  return (
    <PageTitle
      title="공고 관리"
      description="등록한 공고를 관리해보세요."
      buttonOnClickFn={() => navigate('/jobs/new')}
      buttonText={'공고 관리'}
    >
      <div className="mx-auto max-w-5xl">
        <JobPostList items={items} />
      </div>
    </PageTitle>
  );
}
