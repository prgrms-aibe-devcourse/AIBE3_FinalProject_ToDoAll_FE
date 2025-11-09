import { useState } from 'react';

export default function ResumeMemo() {
  const [memo, setMemo] = useState('');

  return (
    <div className="flex flex-col">
      <h3 className="font-semibold mb-2 text-[#413F3F] text-[14px]">memo</h3>

      {/* textarea + 버튼을 감싸는 relative 컨테이너 */}
      <div className="relative">
        <textarea
          className="w-full h-32 bg-white rounded-lg p-3 pr-16 shadow-md focus:shadow-lg transition-shadow resize-none border-[#837C7C] text-[#413F3F] text-[14px]"
          placeholder="메모를 입력하세요..."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
        {/* textarea 안 오른쪽 아래에 고정되는 버튼 */}
        <button
          onClick={() => console.log('메모 저장:', memo)}
          className="absolute bottom-4 right-2 bg-[#F7B534] text-[#FAF8F8] px-3 py-1 rounded-[90px] text-[12px] hover:opacity-90 transition"
        >
          저장
        </button>
      </div>
    </div>
  );
}
