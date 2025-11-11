import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';

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
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">경험/활동/교육</h2>
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
        {list.map((e, idx) => (
          <div key={idx} className="flex gap-2 flex-wrap p-2 border-b border-[#837C7C]">
            <span className="font-medium">{e.type}</span>
            <span>{e.title}</span>
            <span>{e.organization}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-[10px] border border-[#E5E5E5]">
          <div className="flex flex-wrap gap-3 items-center mt-2">
            <select
              value={expInput.type}
              onChange={(e) => setExpInput({ ...expInput, type: e.target.value })}
              className="border py-2 px-3 rounded-[10px] w-32"
            >
              <option value="경험">경험</option>
              <option value="활동">활동</option>
              <option value="교육">교육</option>
            </select>
            <input
              type="text"
              placeholder="제목 작성"
              value={expInput.title}
              onChange={(e) => setExpInput({ ...expInput, title: e.target.value })}
              className="border py-2 px-3 rounded-[10px] flex-1"
            />
            <input
              type="text"
              placeholder="수행 기관"
              value={expInput.organization}
              onChange={(e) => setExpInput({ ...expInput, organization: e.target.value })}
              className="border py-2 px-3 rounded-[10px] flex-1"
            />
          </div>

          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-[#E3DBDB] rounded-[8px] hover:bg-[#B1A0A0] transition"
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
