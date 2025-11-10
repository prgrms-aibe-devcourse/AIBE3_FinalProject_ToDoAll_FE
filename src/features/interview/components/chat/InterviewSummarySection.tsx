import type { InterviewSummary } from '../../types/chatroom';

interface InterviewSummarySectionProps {
  summaries: InterviewSummary[];
}

export default function InterviewSummarySection({ summaries }: InterviewSummarySectionProps) {
  return (
    <div className="w-[25%] rounded-2xl flex flex-col">
      {summaries.map((item, idx) => (
        <div key={idx} className="bg-jd-gray-light rounded-xl p-4 shadow-sm mb-2">
          <h3 className="text-sm font-semibold mb-1 text-jd-violet">{item.title}</h3>
          <p className="text-sm leading-relaxed text-jd-black mt-2">{item.content}</p>
        </div>
      ))}
    </div>
  );
}
