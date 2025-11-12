import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import arrowImg from '../../../assets/Expand Arrow-2.png';

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
            className="flex flex-wrap gap-2 border-b border-[#837C7C] p-2 last:border-b-0"
          >
            <span className="font-medium">{c.type}</span>
            <span>{c.title}</span>
            <span>{c.hasScore && c.score ? `${c.score}점` : ''}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="relative w-32">
              <select
                value={certInput.type}
                onChange={(e) => setCertInput({ ...certInput, type: e.target.value })}
                className="w-full appearance-none rounded-[10px] border bg-[#faf8f8] px-3 py-2 text-[#413F3F] focus:outline-none"
              >
                <option value="자격">자격</option>
                <option value="어학">어학</option>
                <option value="수상">수상</option>
              </select>
              <img
                src={arrowImg}
                alt="arrow"
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-60"
              />
            </div>
            <input
              type="text"
              placeholder="항목 입력"
              value={certInput.title}
              onChange={(e) => setCertInput({ ...certInput, title: e.target.value })}
              className="basis-1/2 rounded-[10px] border px-3 py-2"
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
                onChange={(e) => setCertInput({ ...certInput, score: e.target.value })}
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
    </>
  );
}
