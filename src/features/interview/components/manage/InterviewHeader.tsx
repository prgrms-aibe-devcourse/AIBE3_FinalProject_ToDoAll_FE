import { type InterviewStatus, statusLabelMap } from '../../types/interviewer';

interface InterviewHeaderProps {
  avatar: string;
  name: string;
  position: string;
  status: InterviewStatus;
}

export default function InterviewHeader({ avatar, name, position, status }: InterviewHeaderProps) {
  // 상태별 스타일
  const statusStyle: Record<InterviewStatus, { bg: string; text: string }> = {
    WAITING: { bg: 'bg-jd-violet', text: 'text-jd-white' },
    IN_PROGRESS: { bg: 'bg-jd-yellow', text: 'text-jd-black' },
    ACCEPTED: { bg: 'bg-green-600', text: 'text-white' },
    ON_HOLD: { bg: 'bg-orange-500', text: 'text-white' },
    REJECTED: { bg: 'bg-jd-scarlet', text: 'text-jd-white' },
    DONE: { bg: 'bg-jd-gray-dark', text: 'text-jd-white' },
  };

  const { bg, text } = statusStyle[status];

  return (
    <div className="mb-3 flex items-center gap-3">
      <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
      <div className="flex flex-col">
        <h3 className="text-jd-black font-semibold">{name}</h3>
        <p className="text-jd-gray-dark text-sm">{position}</p>
      </div>
      <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`}>
        {statusLabelMap[status]}
      </span>
    </div>
  );
}
