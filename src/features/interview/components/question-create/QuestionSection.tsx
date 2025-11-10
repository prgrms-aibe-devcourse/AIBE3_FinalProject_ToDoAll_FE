interface QuestionSectionProps {
  section: { title: string; questions: string[] };
  sectionIdx: number;
  isEditing: boolean;
  /* eslint-disable-next-line no-unused-vars */
  onTitleChange: (sectionIdx: number, newTitle: string) => void;
  /* eslint-disable-next-line no-unused-vars */
  onQuestionChange: (sectionIdx: number, questionIdx: number, newValue: string) => void;
}

export default function QuestionSection({
  section,
  sectionIdx,
  isEditing,
  onTitleChange,
  onQuestionChange,
}: QuestionSectionProps) {
  return (
    <div className="mb-6">
      {isEditing ? (
        <input
          type="text"
          value={section.title}
          onChange={(e) => onTitleChange(sectionIdx, e.target.value)}
          className="font-semibold text-[20px] text-jd-gray-dark mb-2 w-full border-b border-jd-gray-light focus:outline-jd-gray-dark"
        />
      ) : (
        <h3 className="font-semibold text-[20px] text-jd-gray-dark mb-2">{section.title}</h3>
      )}

      <ul className="space-y-1 text-jd-black list-disc pl-8 ml-4">
        {section.questions.map((q, i) => (
          <li key={i}>
            {isEditing ? (
              <input
                type="text"
                value={q}
                onChange={(e) => onQuestionChange(sectionIdx, i, e.target.value)}
                className="border border-jd-gray-light rounded px-2 py-1 w-full text-sm focus:outline-jd-gray-dark"
              />
            ) : (
              q
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
