import JobPostCard from './JobPostCard';
import type { JobPost, OpenHandler } from '../../types/JobPost.types';

type Props = {
  post: JobPost;
  onOpen?: OpenHandler;
};

export default function JobPostCardContainer({ post, onOpen }: Props) {
  const statusLabel = post.status === 'OPEN' ? '진행중' : '마감';
  const updatedAt = post.deadline
    ? `마감일: ${new Date(post.deadline).toLocaleDateString()}`
    : undefined;
  const postedAt = `등록일: ${new Date(post.postedAt).toLocaleDateString()}`;

  return (
    <JobPostCard
      title={post.title}
      location={post.location}
      applicantsLabel={`${post.applicantCount}명 지원`}
      statusLabel={statusLabel}
      thumbnailUrl={post.thumbnailUrl}
      skills={post.skills}
      updatedAt={updatedAt}
      postedAt={postedAt}
      onClick={() => onOpen?.(post.id)}
    />
  );
}
