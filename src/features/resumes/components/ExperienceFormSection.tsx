import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import arrowImg from '../../../assets/Expand Arrow-2.png';

type Experience = { type: string; title: string; organization: string };

export default function ExperienceFormSection({
  experienceData: _experienceData,
  onChange,
}: {
  experienceData: string[];
  onChange: (_updated: string[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [expInput, setExpInput] = useState<Experience>({
    type: '경험',
    title: '',
    organization: '',
  });
  const [list, setList] = useState<Experience[]>([]);

  const addExperience = () => {
    if (!expInput.title.trim()) return;
    const updatedList = [...list, expInput];
    setList(updatedList);
    onChange(updatedList.map((i) => `${i.type}:${i.title}:${i.organization}`));
    setExpInput({ type: '경험', title: '', organization: '' });
    setShowForm(false);
  };

  return (
    <>
      <div className="flex items-center justify-between border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold">경험/활동/교육</h2>
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
        {list.map((e, idx) => (
          <div
            key={idx}
            className="flex flex-wrap gap-2 border-b border-[#837C7C] p-2 last:border-b-0"
          >
            <span className="font-medium">{e.type}</span>
            <span>{e.title}</span>
            <span>{e.organization}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="relative flex-1">
              <select
                value={expInput.type}
                onChange={(e) => setExpInput({ ...expInput, type: e.target.value })}
                className="w-full appearance-none rounded-[10px] border bg-[#faf8f8] px-3 py-2 text-[#413F3F] focus:outline-none"
              >
                <option value="경험">경험</option>
                <option value="활동">활동</option>
                <option value="교육">교육</option>
              </select>

              <img
                src={arrowImg}
                alt="arrow"
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-60"
              />
            </div>

            <input
              type="text"
              placeholder="제목 작성"
              value={expInput.title}
              onChange={(e) => setExpInput({ ...expInput, title: e.target.value })}
              className="flex-1 rounded-[10px] border px-3 py-2"
            />
            <input
              type="text"
              placeholder="수행 기관"
              value={expInput.organization}
              onChange={(e) => setExpInput({ ...expInput, organization: e.target.value })}
              className="flex-1 rounded-[10px] border px-3 py-2"
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="rounded-[8px] bg-[#E3DBDB] px-4 py-2 transition hover:bg-[#B1A0A0]"
              onClick={addExperience}
            >
              입력
            </button>
          </div>
        </div>
      )}
    </>
  );
}
