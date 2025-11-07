import { useState } from 'react';

export default function ResumeMemo() {
  const [memo, setMemo] = useState('');

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-semibold mb-2">memo</h3>
      <textarea
        className="flex-1 border rounded-lg p-2 resize-none"
        placeholder="메모를 입력하세요..."
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
      />

      {/* 내부 Button 포함 */}
      <button
        onClick={() => console.log('메모 저장:', memo)}
        className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium shadow"
      >
        저장
      </button>
    </div>
  );
}
