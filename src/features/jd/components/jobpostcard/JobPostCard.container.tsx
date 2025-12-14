import JobPostCard from './JobPostCard';
import type { JobPost, JobStatus, OpenHandler } from '../../types/JobPost.types';

type Props = {
  post: JobPost;
  onOpen?: OpenHandler;
};

export default function JobPostCardContainer({ post, onOpen }: Props) {
  const updatedAt = post.deadline
    ? `마감일: ${new Date(post.deadline).toLocaleDateString()}`
    : undefined;
  const postedAt = `등록일: ${new Date(post.postedAt).toLocaleDateString()}`;

  return (
    <JobPostCard
      title={post.title}
      location={post.location}
      applicantsLabel={`${post.applicantCount}명 지원`}
      status={post.status as JobStatus}
      thumbnailUrl={post.thumbnailUrl}
      skills={post.skills}
      updatedAt={updatedAt}
      postedAt={postedAt}
      onClick={() => onOpen?.(post.id)}
    />
  );
}
