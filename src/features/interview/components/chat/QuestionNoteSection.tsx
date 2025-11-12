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
    <div className="border-jd-gray-light flex max-h-full w-[35%] flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-md">
      <h2 className="text-jd-gray-dark mb-4 shrink-0 text-2xl font-semibold">질문 노트</h2>
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex-1 overflow-y-auto pr-2">
        {questionNotes.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h3 className="text-jd-gray-dark mb-2 font-semibold">{section.topic}</h3>
            <ul className="space-y-2">
              {section.questions.map((q, i) => (
                <li
                  key={i}
                  className="bg-jd-white flex items-center justify-between rounded-xl p-3 text-sm"
                >
                  <span className="text-jd-black">{q}</span>
                  <button
                    onClick={() => toggleCheck(q)}
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition ${
                      checkedQuestions.has(q)
                        ? 'bg-[#DE4F36] text-white'
                        : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
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
