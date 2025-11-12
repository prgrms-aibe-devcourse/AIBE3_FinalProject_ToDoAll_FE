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
    <div className="w-[25%] flex flex-col max-h-full rounded-2xl shadow-md bg-white border border-jd-gray-light overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {summaryList.map((item, idx) => {
          const isMine = item.authorId === currentUserId; // 내가 쓴 글인지 판별
          const isEditing = editingIdx === idx;

          return (
            <div key={item.id} className="bg-jd-gray-light rounded-xl p-4 shadow-sm relative">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleEdit(idx, 'title', e.target.value)}
                    onBlur={handleBlur}
                    className="w-full text-sm font-semibold mb-2 border-b border-jd-gray-light bg-transparent focus:outline-jd-violet"
                  />
                  <textarea
                    value={item.content}
                    onChange={(e) => handleEdit(idx, 'content', e.target.value)}
                    onBlur={handleBlur}
                    rows={3}
                    className="w-full text-sm text-jd-black bg-white rounded-md border border-jd-gray-light focus:outline-jd-violet resize-none p-2"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold mb-1 text-jd-violet flex justify-between items-center">
                    <span>{item.title}</span>
                    {isMine && (
                      <button
                        onClick={() => setEditingIdx(idx)}
                        className="text-xs text-jd-gray-dark hover:text-jd-violet transition"
                      >
                        ✎
                      </button>
                    )}
                  </h3>
                  <p className="text-sm leading-relaxed text-jd-black whitespace-pre-wrap">
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
