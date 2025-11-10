import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { QuestionSection } from '../../types/chatroom';

interface QuestionNoteSectionProps {
  questionNotes: QuestionSection[];
}

export default function QuestionNoteSection({ questionNotes }: QuestionNoteSectionProps) {
  const [checkedQuestions, setCheckedQuestions] = useState<Set<string>>(new Set());

  const toggleCheck = (question: string) => {
    const newSet = new Set(checkedQuestions);
    newSet.has(question) ? newSet.delete(question) : newSet.add(question);
    setCheckedQuestions(newSet);
  };

  return (
    <div className="w-[35%] bg-white border border-jd-gray-light rounded-2xl shadow-md p-6 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4 text-jd-gray-dark">질문 노트</h2>
      {questionNotes.map((section, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="font-semibold mb-2 text-jd-gray-dark">{section.topic}</h3>
          <ul className="space-y-2">
            {section.questions.map((q, i) => (
              <li
                key={i}
                className="flex items-center justify-between bg-jd-white rounded-xl p-3 text-sm"
              >
                <span className="text-jd-black">{q}</span>
                <button
                  onClick={() => toggleCheck(q)}
                  className={`w-6 h-6 flex items-center justify-center rounded-full transition ${
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
  );
}
