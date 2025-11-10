interface InterviewInfoProps {
  date: string;
  time: string;
  interviewers: string;
}

export default function InterviewInfoSection({ date, time, interviewers }: InterviewInfoProps) {
  return (
    <div className="flex justify-between text-left text-sm text-gray-600 mb-5 px-2">
      <div className="flex-1">
        <p className="font-medium text-gray-500 mb-1">일자</p>
        <p className="text-gray-700">{date}</p>
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-500 mb-1">시간</p>
        <p className="text-gray-700">{time}</p>
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-500 mb-1">면접관</p>
        <p className="text-gray-700">{interviewers}</p>
      </div>
    </div>
  );
}
