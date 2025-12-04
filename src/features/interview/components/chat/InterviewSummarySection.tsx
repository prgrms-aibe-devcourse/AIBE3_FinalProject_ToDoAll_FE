import { useState, useEffect } from 'react';
import type { InterviewSummary } from '../../types/chatroom';

interface InterviewSummarySectionProps {
  summaries: InterviewSummary[];
  currentUserId: number;
  onSendNote?: (_content: string) => void;

  // ✅ 추가: memoId + content로 서버 저장
  onUpdateMemo?: (_memoId: number, _content: string) => Promise<void> | void;
}

export default function InterviewSummarySection({
  summaries,
  currentUserId,
  onSendNote,
  onUpdateMemo,
}: InterviewSummarySectionProps) {
  const [summaryList, setSummaryList] = useState<InterviewSummary[]>(summaries);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isWriting, setIsWriting] = useState(false);

  // ✅ 저장 UX 상태
  const [savingIdx, setSavingIdx] = useState<number | null>(null);
  const [savedIdx, setSavedIdx] = useState<number | null>(null);

  useEffect(() => {
    setSummaryList(summaries);
  }, [summaries]);

  // 수정 핸들러(로컬 반영)
  const handleEdit = (idx: number, key: keyof InterviewSummary, value: string) => {
    setSummaryList((prev) => prev.map((item, i) => (i === idx ? { ...item, [key]: value } : item)));
  };

  // ✅ 수정 종료(blur) 시 DB 저장
  const handleBlur = async (idx: number) => {
    setEditingIdx(null);

    const item = summaryList[idx];
    if (!item) return;

    // 원하면: 내 메모만 수정 저장 (다른 사람 메모는 편집 버튼도 없어서 사실상 필요 없긴 함)
    if (item.authorId !== currentUserId) return;

    if (!onUpdateMemo) return;

    try {
      setSavingIdx(idx);
      await onUpdateMemo(item.id, item.content);
      setSavingIdx(null);
      setSavedIdx(idx);
      window.setTimeout(() => setSavedIdx(null), 1200);
    } catch (e) {
      setSavingIdx(null);
      // 실패 UX는 최소로 콘솔만(원하면 토스트 가능)
      console.error('메모 저장 실패:', e);
    }
  };

  // 새 메모 작성 핸들러(WS 전송)
  const handleSendNote = () => {
    const trimmed = newNoteContent.trim();
    if (!trimmed || !onSendNote) return;

    onSendNote(trimmed);
    setNewNoteContent('');
    setIsWriting(false);
  };

  // 내 메모 찾기
  const mySummary = summaryList.find((s) => s.authorId === currentUserId);

  return (
    <div className="border-jd-gray-light flex max-h-full w-[25%] flex-col overflow-hidden rounded-2xl border bg-white shadow-md">
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 space-y-3 overflow-y-auto p-6">
        {/* 새 메모 작성 영역 */}
        {!isWriting && !mySummary && (
          <button
            onClick={() => setIsWriting(true)}
            className="bg-jd-gray-light hover:bg-jd-gray-dark text-jd-black w-full rounded-xl border border-dashed border-gray-300 p-4 text-sm transition"
          >
            + 메모 작성하기
          </button>
        )}

        {isWriting && (
          <div className="bg-jd-gray-light rounded-xl p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-jd-violet text-sm font-semibold">새 메모</h3>
              <div className="flex gap-2">
                <button
                  onClick={handleSendNote}
                  disabled={!newNoteContent.trim()}
                  className="bg-jd-violet hover:bg-jd-violet-hover rounded px-3 py-1 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  저장
                </button>
                <button
                  onClick={() => {
                    setIsWriting(false);
                    setNewNoteContent('');
                  }}
                  className="text-jd-gray-dark hover:text-jd-black rounded px-3 py-1 text-xs transition"
                >
                  취소
                </button>
              </div>
            </div>
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="메모를 입력하세요..."
              rows={4}
              className="text-jd-black border-jd-gray-light focus:outline-jd-violet w-full resize-none rounded-md border bg-white p-2 text-sm"
              autoFocus
            />
          </div>
        )}

        {/* 기존 메모 목록 */}
        {summaryList.map((item, idx) => {
          const isMine = item.authorId === currentUserId;
          const isEditing = editingIdx === idx;

          return (
            <div key={item.id} className="bg-jd-gray-light relative rounded-xl p-4 shadow-sm">
              {/* ✅ 저장 UX */}
              {savingIdx === idx && (
                <span className="text-jd-gray-dark absolute top-3 right-3 rounded-full bg-white/70 px-2 py-0.5 text-[11px]">
                  저장 중...
                </span>
              )}
              {savedIdx === idx && (
                <span className="text-jd-gray-dark absolute top-3 right-3 rounded-full bg-white/70 px-2 py-0.5 text-[11px]">
                  저장됨 ✅
                </span>
              )}

              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleEdit(idx, 'title', e.target.value)}
                    onBlur={() => void handleBlur(idx)}
                    className="border-jd-gray-light focus:outline-jd-violet mb-2 w-full border-b bg-transparent text-sm font-semibold"
                  />
                  <textarea
                    value={item.content}
                    onChange={(e) => handleEdit(idx, 'content', e.target.value)}
                    onBlur={() => void handleBlur(idx)}
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
