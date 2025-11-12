import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import type { Skill } from '../types/resumes.types';
import arrowImg from '../../../assets/Expand Arrow-2.png';

export default function SkillFormSection({
  skills,
  onChange,
}: {
  skills: Skill[];
  onChange: (_updated: Skill[]) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [skillInput, setSkillInput] = useState<Skill>({ name: '', level: '초급' });

  const addSkill = () => {
    if (!skillInput.name.trim()) return;
    const updated = [...skills, skillInput];
    onChange(updated);
    setSkillInput({ name: '', level: '초급' });
    setShowForm(false);
  };

  return (
    <>
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">스킬</h2>
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
        {skills.map((s, idx) => (
          <div
            key={idx}
            className="flex gap-2 flex-wrap p-2 border-b border-[#837C7C] last:border-b-0"
          >
            <span className="font-medium">{s.name}</span>
            <span>{s.level}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-[10px] border border-[#E5E5E5]">
          <div className="flex flex-wrap gap-3 items-center mt-2">
            <input
              className="border py-2 px-3 rounded-[10px] flex-1 min-w-[200px]"
              placeholder="스킬 입력"
              value={skillInput.name}
              onChange={(e) => setSkillInput({ ...skillInput, name: e.target.value })}
            />
            <div className="relative w-36">
              <select
                value={skillInput.level}
                onChange={(e) =>
                  setSkillInput({
                    ...skillInput,
                    level: e.target.value as '초급' | '중급' | '고급',
                  })
                }
                className="border py-2 px-3 rounded-[10px] w-full appearance-none bg-[#faf8f8] text-[#413F3F] focus:outline-none"
              >
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
              <img
                src={arrowImg}
                alt="arrow"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-60"
              />
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-[#E3DBDB] rounded-[8px] hover:bg-[#B1A0A0] transition"
              onClick={addSkill}
            >
              입력
            </button>
          </div>
        </div>
      )}
    </>
  );
}
