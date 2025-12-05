import {
  type InterviewStatus,
  type ResultStatus,
  statusLabelMap,
  resultStatusLabelMap,
} from '../../types/interviewer';

interface InterviewHeaderProps {
  avatar: string;
  name: string;
  position: string;
  status: InterviewStatus;
  result: ResultStatus;
}

export default function InterviewHeader({
  avatar,
  name,
  position,
  status,
  result,
}: InterviewHeaderProps) {
  const statusStyle: Record<InterviewStatus, { bg: string; text: string }> = {
    WAITING: { bg: 'bg-jd-violet', text: 'text-jd-white' },
    IN_PROGRESS: { bg: 'bg-jd-yellow', text: 'text-jd-black' },
    DONE: { bg: 'bg-jd-gray-dark', text: 'text-jd-white' },
  };

  const resultStyle: Record<ResultStatus, { bg: string; text: string }> = {
    PASS: { bg: 'bg-green-600', text: 'text-white' },
    HOLD: { bg: 'bg-blue-600', text: 'text-jd-white' },
    FAIL: { bg: 'bg-jd-scarlet', text: 'text-jd-white' },
    PENDING: { bg: 'bg-jd-gray-dark', text: 'text-jd-white' },
  };

  const isDone = status === 'DONE';

  const { bg, text } = isDone
    ? resultStyle[result] // DONE → 결과 스타일
    : statusStyle[status]; // 나머지 → 진행 상태 스타일

  const label = isDone ? resultStatusLabelMap[result] : statusLabelMap[status];

  return (
    <div className="mb-3 flex items-center gap-3">
      <img src={avatar} alt={name} className="h-12 w-12 rounded-full object-cover" />
      <div className="flex flex-col">
        <h3 className="text-jd-black font-semibold">{name}</h3>
        <p className="text-jd-gray-dark text-sm">{position}</p>
      </div>
      <span className={`ml-auto rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`}>
        {label}
      </span>
    </div>
  );
}
