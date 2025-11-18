import type { ResumeData } from '../types/resumes.types';

interface ApplicantInfoProps {
  data: Pick<ResumeData, 'email' | 'phone' | 'applyDate'>;
}

export default function ApplicantInfo({ data }: ApplicantInfoProps) {
  // applyDate 포맷 변환
  const formatDate = (isoString: string | undefined) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-3 border-t border-b p-4" style={{ borderColor: '#837C7C' }}>
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#413F3F]">이메일</span>
        <span className="text-[14px] font-light text-[#413F3F]">{data.email}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#413F3F]">연락처</span>
        <span className="text-[14px] font-light text-[#413F3F]">{data.phone}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#413F3F]">접수일</span>
        <span className="text-[14px] font-light text-[#413F3F]">{formatDate(data.applyDate)}</span>
      </div>
    </div>
  );
}
