import type { JobDetail } from '../../types/JobDetail.types';
import { JobDetailHeader } from './JobDetailHeader';
import { JobMedia } from './JobMedia';
import { JobDetailMetaGrid } from './JobDetailMetaGrid';
import ApplicantCount from '../shared/ApplicantCount';

type Mode = 'owner' | 'public';
interface JobDetailViewProps {
  job: JobDetail;
  onEdit?: () => void;
  mode?: Mode;
}

export default function JobDetailView({ job, mode, onEdit }: JobDetailViewProps) {
  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-[#fff7f0] p-4 ring-1 ring-orange-200 sm:p-6">
      <JobDetailHeader job={job} mode={mode ?? 'owner'} onEdit={onEdit} />
      <div className="mt-4 mb-4 flex flex-col items-end justify-center text-xs text-gray-500">
        <div>등록일: {new Date(job.postedAt).toLocaleDateString()}</div>
        {job.deadline && <div>마감일: {new Date(job.deadline).toLocaleDateString()}</div>}
      </div>
      <hr className="text-gray-500" />
      <div className="mt-4 flex items-end text-xs text-gray-500">
        <ApplicantCount count={job.applicantCount} className="ml-auto" />
      </div>
      <div className="my-4">
        <JobMedia src={job.thumbnailUrl} />
      </div>
      <JobDetailMetaGrid job={job} />
    </div>
  );
}
