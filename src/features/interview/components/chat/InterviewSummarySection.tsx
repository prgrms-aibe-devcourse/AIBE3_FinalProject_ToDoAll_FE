import type { InterviewSummary } from '../../types/chatroom';

interface InterviewSummarySectionProps {
  summaries: InterviewSummary[];
}

export default function InterviewSummarySection({ summaries }: InterviewSummarySectionProps) {
  return (
    <div className="w-[25%] flex flex-col max-h-full rounded-2xl shadow-md bg-white border border-jd-gray-light overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {summaries.map((item, idx) => (
          <div key={idx} className="bg-jd-gray-light rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold mb-1 text-jd-violet">{item.title}</h3>
            <p className="text-sm leading-relaxed text-jd-black">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
