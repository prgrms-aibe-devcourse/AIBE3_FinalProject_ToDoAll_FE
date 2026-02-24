import InterviewHeader from './InterviewHeader';
import InterviewInfoSection from './InterviewInfoSection';
import InterviewActions from './InterviewActions';
import { type InterviewStatus, type ResultStatus } from '../../types/interviewer';
import { useState } from 'react';

export interface InterviewCardProps {
  id: number;
  name: string;
  position: string;
  date: string;
  time: string;
  interviewers: string;
  status: InterviewStatus;
  result: ResultStatus;
  avatar: string;
  resumeId: number;
}

export default function InterviewCard({
  id,
  name,
  position,
  date,
  time,
  interviewers,
  status,
  result,
  avatar,
  resumeId,
}: InterviewCardProps) {
  const [currResult, setResult] = useState<ResultStatus>(result);

  return (
    <section
      key={id}
      className="relative flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg"
    >
      <section>
        <InterviewHeader
          avatar={avatar}
          name={name}
          position={position}
          status={status}
          result={currResult}
        />

        <InterviewInfoSection date={date} time={time} interviewers={interviewers} />
      </section>
      <InterviewActions
        status={status}
        result={currResult}
        name={name}
        avatar={avatar}
        interviewId={id}
        resumeId={resumeId}
        date={date}
        time={time}
        interviewers={interviewers}
        position={position}
        onResultChange={setResult}
      />
    </section>
  );
}
