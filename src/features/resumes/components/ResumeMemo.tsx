import { useState } from 'react';
import { updateResumeMemo } from '../data/resumes.api';

export default function ResumeMemo({
  resumeId,
  initialMemo,
}: {
  resumeId: string;
  initialMemo: string;
}) {
  const [memo, setMemo] = useState(initialMemo || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const result = await updateResumeMemo(resumeId, memo);
      console.log('메모 저장 성공:', result);
      alert('메모가 저장되었습니다.');
    } catch (err: any) {
      alert(err.message || '메모 저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

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
          disabled={saving}
          onClick={handleSave}
          className="absolute right-2 bottom-4 rounded-[90px] bg-[#F7B534] px-3 py-1 text-[12px] text-[#FAF8F8] transition hover:opacity-90 disabled:opacity-50"
        >
          {saving ? '저장중...' : '저장'}
        </button>
      </div>
    </div>
  );
}
