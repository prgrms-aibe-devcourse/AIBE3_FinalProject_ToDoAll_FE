import { useState } from 'react';
import { Check } from 'lucide-react';
import type { QuestionSection } from '../../types/chatroom';
import BlankCard from '@shared/components/BlankCard.tsx';

interface QuestionNoteSectionProps {
  questionNotes: QuestionSection[];
  onToggleCheck?: (_questionId: number) => Promise<void>;
}

export default function QuestionNoteSection({
  questionNotes,
  onToggleCheck,
}: QuestionNoteSectionProps) {
  const [updatingQuestions, setUpdatingQuestions] = useState<Set<number>>(new Set());

  const toggleCheck = async (questionId: number) => {
    if (updatingQuestions.has(questionId)) return;

    setUpdatingQuestions((prev) => new Set(prev).add(questionId));

    try {
      if (onToggleCheck) {
        await onToggleCheck(questionId);
      }
    } catch (error) {
      console.error('질문 체크 토글 실패:', error);
    } finally {
      setUpdatingQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  return (
    <div className="border-jd-gray-light flex max-h-full flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-md sm:flex-4">
      <h2 className="text-jd-gray-dark mb-4 shrink-0 text-2xl font-semibold">질문 노트</h2>
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto pr-2">
        {questionNotes.length <= 0 ? (
          <BlankCard text="등록된 질문이 없습니다." className="pt-4 pb-4" />
        ) : (
          questionNotes.map((section) => (
            <div key={section.topic} className="mb-6">
              <h3 className="text-jd-gray-dark mb-2 font-semibold">{section.topic}</h3>
              <ul className="space-y-2">
                {section.questions.map((q) => (
                  <li
                    key={q.id}
                    className="bg-jd-white flex items-center justify-between rounded-xl p-3 text-sm"
                  >
                    <span className="text-jd-black">{q.content}</span>
                    <button
                      onClick={() => toggleCheck(q.id)}
                      disabled={updatingQuestions.has(q.id)}
                      className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                        q.checked
                          ? 'bg-[#DE4F36] text-white'
                          : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                      } ${updatingQuestions.has(q.id) ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <Check size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
