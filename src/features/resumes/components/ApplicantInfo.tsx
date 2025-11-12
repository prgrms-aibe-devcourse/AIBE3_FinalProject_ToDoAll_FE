import { useState } from 'react';
import type { ResumeData } from '../types/resumes.types';
import plusImg from '../../../assets/mdi-light_plus-box.png';

interface ApplicantInfoProps {
  data: Pick<ResumeData, 'email' | 'phone' | 'applyDate'>;
}

export default function ApplicantInfo({ data }: ApplicantInfoProps) {
  const [tags, setTags] = useState(['주니어']);
  const [newTag, setNewTag] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const addTag = () => {
    if (newTag.trim() === '') return;
    if (tags.includes(newTag.trim())) return;
    setTags([...tags, newTag.trim()]);
    setNewTag('');
    setIsInputVisible(false);
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3 border-t border-b p-4" style={{ borderColor: '#837C7C' }}>
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#413F3F]">이메일</span>
        <span className="text-[14px] font-light text-[#413F3F]">{data.email}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#413F3F]">연락처</span>
        <span className="text-[14px] font-light text-[#413F3F]">{data.phone}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[14px] font-semibold text-[#413F3F]">접수일</span>
        <span className="text-[14px] font-light text-[#413F3F]">{data.applyDate}</span>
      </div>

      <div>
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#413F3F]">태그</span>
          <img
            src={plusImg}
            alt="태그 추가"
            className="h-5 w-5 cursor-pointer transition hover:scale-110"
            onClick={() => setIsInputVisible(!isInputVisible)}
          />
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
                onClick={addTag}
                className="rounded-lg px-3 py-1 text-[14px]"
                style={{ backgroundColor: '#413F3F', color: '#FFFFFF' }}
              >
                등록
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
