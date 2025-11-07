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
    <div className="p-4 space-y-3 border-t border-b" style={{ borderColor: '#837C7C' }}>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-[14px] text-[#413F3F]">이메일</span>
        <span className="font-light text-[14px] text-[#413F3F]">{data.email}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-[14px] text-[#413F3F]">연락처</span>
        <span className="font-light text-[14px] text-[#413F3F]">{data.phone}</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="font-semibold text-[14px] text-[#413F3F]">접수일</span>
        <span className="font-light text-[14px] text-[#413F3F]">{data.applyDate}</span>
      </div>

      <div>
        {/* 태그 제목 + 플러스 아이콘 한 줄 정렬 */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[14px] text-[#413F3F]">태그</span>
          <img
            src={plusImg}
            alt="태그 추가"
            className="w-5 h-5 cursor-pointer hover:scale-110 transition"
            onClick={() => setIsInputVisible(!isInputVisible)}
          />
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
                onClick={addTag}
                className="px-3 py-1 rounded-lg text-[14px]"
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
