import JobPostCardContainer from '../jobpostcard/JobPostCard.container';
import { JobPostCardSkeleton } from '../jobpostcard/JobPostCard';
import type { JobPost, OpenHandler } from '../../types/JobPost.types';

type Props = {
  items: JobPost[];
  isLoading?: boolean;
  onOpen?: OpenHandler; // ← 동일하게 별칭 사용
};

export default function JobPostList({ items, isLoading, onOpen }: Props) {
  if (isLoading) {
    return (
      <div className="space-y-3 sm:space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <JobPostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
        등록된 공고가 없습니다
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {items.map((p) => (
        <JobPostCardContainer key={p.id} post={p} onOpen={onOpen} />
      ))}
    </div>
  );
}
