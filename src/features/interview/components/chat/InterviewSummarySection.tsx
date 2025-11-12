import { useState, useEffect } from 'react';
import type { InterviewSummary } from '../../types/chatroom';

interface InterviewSummarySectionProps {
  summaries: InterviewSummary[];
  currentUserId: number;
}

export default function InterviewSummarySection({
  summaries,
  currentUserId,
}: InterviewSummarySectionProps) {
  const [summaryList, setSummaryList] = useState<InterviewSummary[]>(summaries);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  useEffect(() => {
    setSummaryList(summaries);
  }, [summaries]);

  // 수정 핸들러
  const handleEdit = (idx: number, key: keyof InterviewSummary, value: string) => {
    setSummaryList((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  // 수정 종료
  const handleBlur = () => setEditingIdx(null);

  return (
    <div className="border-jd-gray-light flex max-h-full w-[25%] flex-col overflow-hidden rounded-2xl border bg-white shadow-md">
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 space-y-3 overflow-y-auto p-6">
        {summaryList.map((item, idx) => {
          const isMine = item.authorId === currentUserId; // 내가 쓴 글인지 판별
          const isEditing = editingIdx === idx;

          return (
            <div key={item.id} className="bg-jd-gray-light relative rounded-xl p-4 shadow-sm">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleEdit(idx, 'title', e.target.value)}
                    onBlur={handleBlur}
                    className="border-jd-gray-light focus:outline-jd-violet mb-2 w-full border-b bg-transparent text-sm font-semibold"
                  />
                  <textarea
                    value={item.content}
                    onChange={(e) => handleEdit(idx, 'content', e.target.value)}
                    onBlur={handleBlur}
                    rows={3}
                    className="text-jd-black border-jd-gray-light focus:outline-jd-violet w-full resize-none rounded-md border bg-white p-2 text-sm"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-jd-violet mb-1 flex items-center justify-between text-sm font-semibold">
                    <span>{item.title}</span>
                    {isMine && (
                      <button
                        onClick={() => setEditingIdx(idx)}
                        className="text-jd-gray-dark hover:text-jd-violet text-xs transition"
                      >
                        ✎
                      </button>
                    )}
                  </h3>
                  <p className="text-jd-black text-sm leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
