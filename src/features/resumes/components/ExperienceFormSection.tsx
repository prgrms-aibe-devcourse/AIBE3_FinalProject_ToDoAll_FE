import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import CustomSelect from './CustomSelect'; // CustomSelect import

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
            <div className="flex-1">
              <CustomSelect
                value={expInput.type}
                onChange={(val) => setExpInput({ ...expInput, type: val })}
                options={[
                  { value: '경험', label: '경험' },
                  { value: '활동', label: '활동' },
                  { value: '교육', label: '교육' },
                ]}
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
