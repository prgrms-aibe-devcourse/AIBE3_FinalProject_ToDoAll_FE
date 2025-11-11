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
    <div className="w-[35%] flex flex-col bg-white border border-jd-gray-light rounded-2xl shadow-md p-6 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {questionNotes.map((section, idx) => (
          <div key={idx} className="mb-8">
            {/* 섹션 제목 */}
            <h3 className="font-semibold mb-3 text-[18px] text-jd-gray-dark">{section.topic}</h3>

            <ul className="space-y-3 list-disc list-inside">
              {section.questions.map((q, i) => (
                <li
                  key={i}
                  className="relative flex items-start justify-between bg-jd-white transition rounded-xl p-4 border border-jd-gray-light text-sm"
                >
                  {/* 질문 내용 */}
                  <div className="flex-1 pr-3">
                    <p className="text-jd-black leading-relaxed">{q}</p>
                  </div>

                  {/* 체크 버튼 */}
                  <button
                    onClick={() => toggleCheck(q)}
                    className={`shrink-0 w-6 h-6 mt-1 flex items-center justify-center rounded-full border transition ${
                      checkedQuestions.has(q)
                        ? 'bg-[#DE4F36] text-white border-[#DE4F36]'
                        : 'bg-white border-gray-300 text-gray-400 hover:bg-gray-100'
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
