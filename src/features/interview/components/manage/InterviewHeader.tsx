import { type InterviewStatus } from '../../types/interviewer';

interface InterviewHeaderProps {
  avatar: string;
  name: string;
  position: string;
  status: InterviewStatus;
}

/**
 * 인터뷰 카드 상단 헤더
 * - 프로필 이미지, 이름, 포지션, 상태 배지 표시
 */
export default function InterviewHeader({ avatar, name, position, status }: InterviewHeaderProps) {
  // 상태별 스타일 매핑
  const statusStyle: Record<InterviewStatus, { bg: string; text: string; label?: string }> = {
    예정: { bg: 'bg-jd-violet', text: 'text-jd-white', label: '면접 시작' },
    진행중: { bg: '', text: '', label: '' },
    합격: { bg: 'bg-jd-scarlet', text: 'text-jd-white', label: '합격' },
    보류: { bg: 'bg-jd-scarlet', text: 'text-jd-white', label: '보류' },
    불합격: { bg: 'bg-jd-scarlet', text: 'text-jd-white', label: '불합격' },
    미정: { bg: '', text: '', label: '' },
  };

  const { bg, text, label } = statusStyle[status];

  return (
    <div className="mb-3 flex items-center gap-3">
      <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
      <div className="flex flex-col">
        <h3 className="text-jd-black font-semibold">{name}</h3>
        <p className="text-jd-gray-dark text-sm">{position}</p>
      </div>
      <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`}>
        {label ?? status}
      </span>
    </div>
  );
}
