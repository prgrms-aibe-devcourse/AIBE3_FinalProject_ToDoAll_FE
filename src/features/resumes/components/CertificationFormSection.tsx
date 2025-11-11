import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';

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
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">자격/어학/수상</h2>
        <button
          type="button"
          className="px-3 py-1 flex items-center gap-1 hover:opacity-80"
          onClick={() => setShowForm(true)}
        >
          <img src={plusImg} alt="plus" className="w-3 h-3" />
          추가
        </button>
      </div>

      <div>
        {list.map((c, idx) => (
          <div key={idx} className="flex gap-2 flex-wrap p-2 border-b border-[#837C7C]">
            <span className="font-medium">{c.type}</span>
            <span>{c.title}</span>
            <span>{c.hasScore && c.score ? `${c.score}점` : ''}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-[10px] border border-[#E5E5E5]">
          <div className="flex flex-wrap gap-3 items-center mt-2">
            <select
              value={certInput.type}
              onChange={(e) => setCertInput({ ...certInput, type: e.target.value })}
              className="border py-2 px-3 rounded-[10px] w-32"
            >
              <option value="자격">자격</option>
              <option value="어학">어학</option>
              <option value="수상">수상</option>
            </select>
            <input
              type="text"
              placeholder="항목 입력"
              value={certInput.title}
              onChange={(e) => setCertInput({ ...certInput, title: e.target.value })}
              className="border py-2 px-3 rounded-[10px] flex-1"
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
                className="border py-2 px-3 rounded-[10px] w-24"
              />
            )}
          </div>

          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-[#E3DBDB] rounded-[8px] hover:bg-[#B1A0A0] transition"
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
