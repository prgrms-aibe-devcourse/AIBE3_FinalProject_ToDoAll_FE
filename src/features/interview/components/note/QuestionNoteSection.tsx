import { useState } from 'react';
import { Check } from 'lucide-react';
import type { QuestionSection } from '../../types/chatroom';

interface QuestionNoteSectionProps {
  questionNotes: QuestionSection[];
}

export default function QuestionNoteSection({ questionNotes }: QuestionNoteSectionProps) {
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());

  const toggleCheck = (question: string) => {
    setCheckedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.has(question) ? newSet.delete(question) : newSet.add(question);
      return newSet;
    });
  };

  return (
    <div className="border-jd-gray-light flex w-[35%] flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-md">
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto pr-2">
        {questionNotes.map((section, idx) => (
          <div key={idx} className="mb-8">
            {/* 섹션 제목 */}
            <h3 className="text-jd-gray-dark mb-3 text-[18px] font-semibold">{section.topic}</h3>

            <ul className="list-inside list-disc space-y-3">
              {section.questions.map((q, i) => (
                <li
                  key={i}
                  className="bg-jd-white border-jd-gray-light relative flex items-start justify-between rounded-xl border p-4 text-sm transition"
                >
                  {/* 질문 내용 */}
                  <div className="flex-1 pr-3">
                    <p className="text-jd-black leading-relaxed">{q}</p>
                  </div>

                  {/* 체크 버튼 */}
                  <button
                    onClick={() => toggleCheck(q)}
                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition ${
                      checkedQuestions.has(q)
                        ? 'border-[#DE4F36] bg-[#DE4F36] text-white'
                        : 'border-gray-300 bg-white text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    <Check size={14} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
