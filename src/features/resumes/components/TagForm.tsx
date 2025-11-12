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
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#413F3F]">{title}</h2>
        <button
          type="button"
          className="px-3 py-1 text-[#413F3F] flex items-center gap-1 transition "
          onClick={() => setIsInputVisible(!isInputVisible)}
        >
          <img src={plusImg} alt="plus" className="w-3 h-3" />
          추가
        </button>
      </div>

      <div className="flex gap-2 mt-2 flex-wrap items-center">
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-sm font-medium rounded-[5px] cursor-pointer"
            style={{ backgroundColor: '#D9D9D9', color: '#413F3F' }}
            onClick={() => removeTag(tag)}
            title="클릭하면 삭제됩니다"
          >
            #{tag} ✕
          </span>
        ))}

        {isInputVisible && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="태그 입력"
              className="border rounded-lg px-2 py-1 text-[14px]"
              style={{ borderColor: '#413F3F', color: '#413F3F' }}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
              autoFocus
            />
            <button
              type="button"
              className="px-4 py-2 bg-[#E3DBDB] text-[#413F3F] rounded-[8px] hover:bg-[#B1A0A0] transition"
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
