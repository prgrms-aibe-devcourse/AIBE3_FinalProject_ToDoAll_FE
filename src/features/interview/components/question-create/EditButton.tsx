interface EditButtonProps {
  isEditing: boolean;
  onToggle: () => void;
}

export default function EditButton({ isEditing, onToggle }: EditButtonProps) {
  return (
    <div className="flex justify-end mt-8">
      <button
        onClick={onToggle}
        className={`px-6 py-2 rounded-lg shadow-md text-white transition ${
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
