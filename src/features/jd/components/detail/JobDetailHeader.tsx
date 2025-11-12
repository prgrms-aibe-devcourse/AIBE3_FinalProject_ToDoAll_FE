import { Pill } from '../shared/Pill';
import type { JobDetail } from '../../types/JobDetail.types';

export function JobDetailHeader({
  job,
  onEdit,
  onClose,
}: {
  job: JobDetail;
  onEdit?: () => void;
  onClose?: () => void;
}) {
  const statusLabel = job.status === 'OPEN' ? '진행중' : '마감';
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-2xl font-bold text-gray-900">{job.title}</h1>
          <span
            className={
              statusLabel === '진행중'
                ? 'rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700'
                : 'rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600'
            }
          >
            {statusLabel}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{job.location}</p>
        {job.skills?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.skills.map((s, i) => (
              <Pill key={s + i}>{s}</Pill>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={onEdit}
          className="rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-gray-200 hover:bg-gray-50"
        >
          진행 상태 변경
        </button>
        <button
          onClick={onClose}
          className="rounded-full bg-orange-500 px-3 py-1.5 text-sm text-white shadow hover:bg-orange-600"
        >
          수정
        </button>
      </div>
    </header>
  );
}
