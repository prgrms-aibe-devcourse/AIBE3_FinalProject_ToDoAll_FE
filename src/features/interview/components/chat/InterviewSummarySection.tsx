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
  const [newSummary, setNewSummary] = useState({ title: '', content: '' });

  useEffect(() => {
    setSummaryList(summaries);
  }, [summaries]);

  // 수정 핸들러
  const handleEdit = (idx: number, key: keyof InterviewSummary, value: string) => {
    setSummaryList((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  // 새 평가 추가
  const handleAddSummary = () => {
    if (!newSummary.title.trim() || !newSummary.content.trim()) return;
    const newItem: InterviewSummary = {
      id: Date.now(),
      authorId: currentUserId, // 내가 작성한 것으로 표시
      title: newSummary.title,
      content: newSummary.content,
    };
    setSummaryList([...summaryList, newItem]);
    setNewSummary({ title: '', content: '' });
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

      {/* 새 평가 추가 */}
      <div className="border-t border-jd-gray-light p-4">
        <h4 className="text-sm font-semibold mb-2 text-jd-gray-dark">새 면접 평가 추가</h4>
        <input
          type="text"
          value={newSummary.title}
          onChange={(e) => setNewSummary({ ...newSummary, title: e.target.value })}
          placeholder="면접관 이름"
          className="w-full mb-2 text-sm border border-jd-gray-light rounded px-2 py-1 focus:outline-jd-violet"
        />
        <textarea
          value={newSummary.content}
          onChange={(e) => setNewSummary({ ...newSummary, content: e.target.value })}
          placeholder="평가 내용을 입력하세요"
          rows={3}
          className="w-full text-sm border border-jd-gray-light rounded px-2 py-1 focus:outline-jd-violet resize-none"
        />
        <button
          onClick={handleAddSummary}
          className="mt-2 w-full bg-jd-violet text-white rounded-md py-1.5 text-sm hover:bg-jd-violet-hover transition"
        >
          추가
        </button>
      </div>
    </div>
  );
}
