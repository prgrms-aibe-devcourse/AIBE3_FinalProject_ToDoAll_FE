import InterviewHeader from './InterviewHeader';
import InterviewInfoSection from './InterviewInfoSection';
import InterviewActions from './InterviewActions';
import { type InterviewStatus } from '../../types/interviewer';

export interface InterviewCardProps {
  id: number;
  name: string;
  position: string;
  date: string;
  time: string;
  interviewers: string;
  status: InterviewStatus;
  avatar: string;
}

export default function InterviewCard({
  id,
  name,
  position,
  date,
  time,
  interviewers,
  status,
  avatar,
}: InterviewCardProps) {
  return (
    <div
      key={id}
      className="relative rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg"
    >
      <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">×</button>

      {/* 헤더 영역 */}
      <InterviewHeader avatar={avatar} name={name} position={position} status={status} />

      {/* 인터뷰 정보 */}
      <InterviewInfoSection date={date} time={time} interviewers={interviewers} />

      {/* 버튼 영역 */}
      <InterviewActions status={status} name={name} avatar={avatar} interviewId={id} />
    </div>
  );
}
