interface QuestionSectionProps {
  section: { title: string; questions: string[] };
  sectionIdx: number;
  isEditing: boolean;
  /* eslint-disable-next-line no-unused-vars */
  onTitleChange: (sectionIdx: number, newTitle: string) => void;
  /* eslint-disable-next-line no-unused-vars */
  onQuestionChange: (sectionIdx: number, questionIdx: number, newValue: string) => void;
  /* eslint-disable-next-line no-unused-vars */
  onAddQuestion: (sectionIdx: number) => void;
  /* eslint-disable-next-line no-unused-vars */
  onDeleteQuestion: (sectionIdx: number, questionIdx: number) => void;
  /* eslint-disable-next-line no-unused-vars */
  onDeleteSection: (sectionIdx: number) => void;
}

export default function QuestionSection({
  section,
  sectionIdx,
  isEditing,
  onTitleChange,
  onQuestionChange,
  onAddQuestion,
  onDeleteQuestion,
  onDeleteSection,
}: QuestionSectionProps) {
  return (
    <div className="mb-6 border-b border-gray-100 pb-4">
      {/* 주제 제목 */}
      <div className="flex items-center justify-between mb-2">
        {isEditing ? (
          <input
            type="text"
            value={section.title}
            onChange={(e) => onTitleChange(sectionIdx, e.target.value)}
            placeholder="새로운 주제를 입력하세요"
            className="font-semibold text-[20px] text-jd-gray-dark w-full border-b border-jd-gray-light focus:outline-jd-gray-dark"
          />
        ) : section.title ? (
          <h3 className="font-semibold text-[20px] text-jd-gray-dark">{section.title}</h3>
        ) : (
          <h3 className="italic text-jd-gray-dark text-[20px]">주제가 입력되지 않았습니다</h3>
        )}

        {/* 주제 삭제 버튼 */}
        {isEditing && (
          <button
            onClick={() => onDeleteSection(sectionIdx)}
            className="text-jd-gray-dark hover:text-jd-scarlet text-[13px] ml-3"
          >
            ✕
          </button>
        )}
      </div>

      {/* 질문 목록 */}
      <ul className="space-y-1 text-jd-black list-disc pl-8 ml-4">
        {section.questions.map((q, i) => (
          <li key={i} className="flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={q}
                  onChange={(e) => onQuestionChange(sectionIdx, i, e.target.value)}
                  placeholder="새로운 질문을 입력하세요"
                  className="border border-jd-gray-light rounded px-2 py-1 w-full text-sm focus:outline-jd-gray-dark"
                />
                {/* 질문 삭제 버튼 */}
                <button
                  onClick={() => onDeleteQuestion(sectionIdx, i)}
                  className="text-jd-gray-dark hover:text-jd-scarlet text-[12px]"
                >
                  ✕
                </button>
              </>
            ) : q ? (
              q
            ) : (
              <span className="text-jd-gray-dark italic">질문이 입력되지 않았습니다</span>
            )}
          </li>
        ))}
      </ul>

      {/* 질문 추가 버튼 */}
      {isEditing && (
        <button
          onClick={() => onAddQuestion(sectionIdx)}
          className="mt-2 ml-4 text-[13px] text-jd-violet hover:text-jd-violet-hover transition"
        >
          ＋ 질문 추가
        </button>
      )}
    </div>
  );
}
