import { useState } from 'react';

export default function ResumeMemo() {
  const [memo, setMemo] = useState('');

  return (
    <div className="flex flex-col">
      <h3 className="mb-2 text-[14px] font-semibold text-[#413F3F]">memo</h3>

      <div className="relative">
        <textarea
          className="h-32 w-full resize-none rounded-lg border-[#837C7C] bg-white p-3 pr-16 text-[14px] text-[#413F3F] shadow-md transition-shadow focus:shadow-lg"
          placeholder="메모를 입력하세요..."
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <button
          onClick={() => console.log('메모 저장:', memo)}
          className="absolute right-2 bottom-4 rounded-[90px] bg-[#F7B534] px-3 py-1 text-[12px] text-[#FAF8F8] transition hover:opacity-90"
        >
          저장
        </button>
      </div>
    </div>
  );
}
