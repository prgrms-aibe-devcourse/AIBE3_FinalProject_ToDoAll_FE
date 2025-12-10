interface EditButtonProps {
  isEditing: boolean;
  onToggle: () => void;
}

export default function EditButton({ isEditing, onToggle }: EditButtonProps) {
  return (
    <div className="mt-8 flex justify-end">
      <button
        onClick={onToggle}
        className={`rounded-lg px-6 py-2 text-white shadow-md transition ${
          isEditing
            ? 'bg-jd-violet-hover hover:bg-jd-violet'
            : 'bg-jd-violet hover:bg-jd-violet-hover'
        }`}
      >
        {isEditing ? '수정 완료' : '질문 수정'}
      </button>
    </div>
  );
}
