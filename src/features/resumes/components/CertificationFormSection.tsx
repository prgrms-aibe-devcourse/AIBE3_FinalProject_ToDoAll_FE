import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import CustomSelect from './CustomSelect'; // CustomSelect import
import AlertModal from '../../../components/Alertmodal';

type Certification = { type: string; title: string; hasScore: boolean; score?: string };

export default function CertificationFormSection({
  certData: _certData,
  onChange,
}: {
  certData: string[];
  onChange: (_updated: string[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [certInput, setCertInput] = useState<Certification>({
    type: '자격',
    title: '',
    hasScore: false,
    score: '',
  });
  const [list, setList] = useState<Certification[]>([]);
  const [showScoreWarning, setShowScoreWarning] = useState(false);

  const addCert = () => {
    if (!certInput.title.trim()) return;
    const updatedList = [...list, certInput];
    setList(updatedList);
    onChange(updatedList.map((i) => `${i.type}:${i.title}:${i.score || ''}`));
    setCertInput({ type: '자격', title: '', hasScore: false, score: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold">자격/어학/수상</h2>
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 hover:opacity-80"
          onClick={() => setShowForm(true)}
        >
          <img src={plusImg} alt="plus" className="h-3 w-3" />
          추가
        </button>
      </div>

      <div>
        {list.map((c, idx) => (
          <div
            key={idx}
            className="relative flex flex-wrap gap-2 border-b border-[#837C7C] p-2 last:border-b-0"
          >
            <span className="font-medium">{c.type}</span>
            <span>{c.title}</span>
            <span>{c.hasScore && c.score ? `${c.score}점` : ''}</span>
            <button
              type="button"
              onClick={() => {
                const updated = list.filter((_, i) => i !== idx);
                setList(updated);
                onChange(updated.map((i) => `${i.type}:${i.title}:${i.score || ''}`));
              }}
              className="absolute top-1 right-1 rounded-full p-1 transition hover:text-[#DE4F36]"
              aria-label={`${c.title} 삭제`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="flex-1">
              <CustomSelect
                value={certInput.type}
                onChange={(val) => setCertInput({ ...certInput, type: val })}
                options={[
                  { value: '자격', label: '자격' },
                  { value: '어학', label: '어학' },
                  { value: '수상', label: '수상' },
                ]}
              />
            </div>

            <input
              type="text"
              placeholder="항목 입력"
              value={certInput.title}
              onChange={(e) => setCertInput({ ...certInput, title: e.target.value })}
              className="flex-1 rounded-[10px] border px-3 py-2"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={certInput.hasScore}
                onChange={(e) => setCertInput({ ...certInput, hasScore: e.target.checked })}
              />
              <span>점수</span>
            </label>

            {certInput.hasScore && (
              <input
                type="text"
                placeholder="점수 입력"
                value={certInput.score}
                onChange={(e) => {
                  const value = e.target.value;
                  // 숫자만 허용 (빈 문자열도 허용)
                  if (value === '' || /^\d+$/.test(value)) {
                    setCertInput({ ...certInput, score: value });
                  } else {
                    // 숫자가 아닌 문자가 포함된 경우 경고 모달 표시
                    setShowScoreWarning(true);
                  }
                }}
                className="w-24 rounded-[10px] border px-3 py-2"
              />
            )}
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="rounded-[8px] bg-[#E3DBDB] px-4 py-2 transition hover:bg-[#B1A0A0]"
              onClick={addCert}
            >
              입력
            </button>
          </div>
        </div>
      )}

      <AlertModal
        open={showScoreWarning}
        type="warning"
        title="입력 오류"
        message="점수는 숫자만 입력 가능합니다. 숫자를 입력해주세요."
        onClose={() => setShowScoreWarning(false)}
        confirmText="확인"
      />
    </>
  );
}
