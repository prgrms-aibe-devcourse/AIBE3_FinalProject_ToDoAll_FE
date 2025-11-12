import type { JobDetail } from '../../types/JobDetail.types';
import { JobDetailHeader } from './JobDetailHeader';
import { JobMedia } from './JobMedia';
import { JobDetailMetaGrid } from './JobDetailMetaGrid';
import ApplicantCount from '../shared/ApplicantCount';

export default function JobDetailView({
  job,
  onEdit,
  onClose,
}: {
  job: JobDetail;
  onEdit?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="mx-auto max-w-5xl rounded-2xl bg-[#fff7f0] p-4 sm:p-6 ring-1 ring-orange-200">
      <JobDetailHeader job={job} onEdit={onEdit} onClose={onClose} />
      <div className="mt-4 mb-4 flex items-end flex-col justify-center text-xs text-gray-500">
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
