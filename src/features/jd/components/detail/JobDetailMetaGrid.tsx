import { MetaCard } from '../shared/MetaCard';
import type { JobDetail } from '../../types/JobDetail.types';

export function JobDetailMetaGrid({ job }: { job: JobDetail }) {
  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <MetaCard label="업무 설명">{job.description}</MetaCard>
      <MetaCard label="우대 스킬">{job.preferredSkills?.join(', ') || '-'}</MetaCard>
      <MetaCard label="복리후생">{job.benefits?.join(', ') || '-'}</MetaCard>
      <MetaCard label="경력">{job.experience || '-'}</MetaCard>
      <MetaCard label="학력">{job.education || '-'}</MetaCard>
      <MetaCard label="근무 형태">{job.workType || '-'}</MetaCard>
      <MetaCard label="연봉">{job.salary || '-'}</MetaCard>
      <MetaCard label="부서">{job.department || '-'}</MetaCard>
    </section>
  );
}
