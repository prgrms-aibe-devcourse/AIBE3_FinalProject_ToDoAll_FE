import { useState, useEffect } from 'react';
import type { InterviewSummary } from '../../types/chatroom';

interface InterviewNoteSummarySectionProps {
  summaries: InterviewSummary[];
  currentUserId: number;
  onUpdateMemo: (_memoId: number, _content: string) => Promise<void> | void;
}

export default function InterviewNoteSummarySection({
  summaries,
  currentUserId,
  onUpdateMemo,
}: InterviewNoteSummarySectionProps) {
  const [summaryList, setSummaryList] = useState<InterviewSummary[]>(summaries);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    setSummaryList(summaries);
  }, [summaries]);

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setEditContent(summaryList[idx].content);
  };

  const handleSaveEdit = async () => {
    if (editingIdx === null) return;

    const target = summaryList[editingIdx];

    try {
      await onUpdateMemo(target.id, editContent);
      // 프론트 상태 업데이트
      setSummaryList((prev) =>
        prev.map((item, i) => (i === editingIdx ? { ...item, content: editContent } : item))
      );
    } finally {
      setEditingIdx(null);
    }
  };

  return (
    <div className="border-jd-gray-light flex max-h-full min-h-[200px] w-full flex-col overflow-hidden rounded-2xl border bg-white shadow-md">
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 space-y-3 overflow-y-auto p-6">
        <h2 className="mb-3 text-base font-semibold text-slate-900">면접관 노트</h2>
        {summaryList.length > 0 ? (
          summaryList.map((item, idx) => {
            const isMine = item.authorId === currentUserId;
            const isEditing = editingIdx === idx;

            return (
              <div key={item.id} className="bg-jd-gray-light relative rounded-xl p-4 shadow-sm">
                {isEditing ? (
                  <>
                    <h3 className="text-jd-violet mb-1 text-sm font-semibold">{item.title}</h3>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className="text-jd-black border-jd-gray-light focus:outline-jd-violet w-full resize-none rounded-md border bg-white p-2 text-sm"
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingIdx(null)}
                        className="text-jd-gray-dark hover:text-jd-black rounded px-3 py-1 text-xs transition"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="bg-jd-violet hover:bg-jd-violet-hover rounded px-3 py-1 text-xs font-semibold text-white transition"
                      >
                        저장
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-jd-violet mb-1 flex items-center justify-between text-sm font-semibold">
                      <span>{item.title}</span>
                      {isMine && (
                        <button
                          onClick={() => startEdit(idx)}
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
          })
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-line text-slate-800">
            작성된 면접 노트가 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}
