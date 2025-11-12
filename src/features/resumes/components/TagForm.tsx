import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';

type TagSectionProps = {
  title: string;
  tags: string[];
  onChange: (_updated: string[]) => void;
};

export default function TagSection({ title, tags, onChange }: TagSectionProps) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    const trimmed = newTag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setNewTag('');
      setIsInputVisible(false);
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold text-[#413F3F]">{title}</h2>
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 text-[#413F3F] transition"
          onClick={() => setIsInputVisible(!isInputVisible)}
        >
          <img src={plusImg} alt="plus" className="h-3 w-3" />
          추가
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="cursor-pointer rounded-[5px] px-2 py-1 text-sm font-medium"
            style={{ backgroundColor: '#D9D9D9', color: '#413F3F' }}
            onClick={() => removeTag(tag)}
            title="클릭하면 삭제됩니다"
          >
            #{tag} ✕
          </span>
        ))}

        {isInputVisible && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="태그 입력"
              className="rounded-lg border px-2 py-1 text-[14px]"
              style={{ borderColor: '#413F3F', color: '#413F3F' }}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              autoFocus
            />
            <button
              type="button"
              className="rounded-[8px] bg-[#E3DBDB] px-4 py-2 text-[#413F3F] transition hover:bg-[#B1A0A0]"
              onClick={addTag}
            >
              등록
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
