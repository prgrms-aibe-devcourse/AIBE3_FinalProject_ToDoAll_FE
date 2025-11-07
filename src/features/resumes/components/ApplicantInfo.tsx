import { useState } from 'react';

export default function ApplicantInfo() {
  const [tags, setTags] = useState(['주니어']);
  const [newTag, setNewTag] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false); // 입력창 표시 여부

  const addTag = () => {
    if (newTag.trim() === '') return;
    if (tags.includes(newTag.trim())) return; // 중복 방지
    setTags([...tags, newTag.trim()]);
    setNewTag('');
    setIsInputVisible(false); // 추가 후 입력창 닫기
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="p-4 border rounded-lg w-80 space-y-3">
      <div>
        <span className="font-semibold">이메일:</span> example@email.com
      </div>
      <div>
        <span className="font-semibold">연락처:</span> 010-1234-5678
      </div>
      <div>
        <span className="font-semibold">접수일:</span> 2025-11-07
      </div>

      <div>
        <span className="font-semibold">태그:</span>
        <div className="flex gap-2 mt-2 flex-wrap items-center">
          {/* 기존 태그들 */}
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full cursor-pointer"
              onClick={() => removeTag(tag)}
              title="클릭하면 삭제됩니다"
            >
              #{tag} ✕
            </span>
          ))}

          {/* + 버튼 */}
          <button
            onClick={() => setIsInputVisible(!isInputVisible)}
            className="px-2 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full font-bold text-lg"
          >
            +
          </button>

          {/* 입력창 (플러스 클릭 시만 표시) */}
          {isInputVisible && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="태그 입력"
                className="border rounded-lg px-2 py-1"
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                autoFocus
              />
              <button
                onClick={addTag}
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg"
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
