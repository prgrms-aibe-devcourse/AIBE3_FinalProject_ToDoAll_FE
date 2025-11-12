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
      <div className="flex items-center justify-between border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold">스킬</h2>
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
        {skills.map((s, idx) => (
          <div
            key={idx}
            className="flex flex-wrap gap-2 border-b border-[#837C7C] p-2 last:border-b-0"
          >
            <span className="font-medium">{s.name}</span>
            <span>{s.level}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              className="min-w-[200px] flex-1 rounded-[10px] border px-3 py-2"
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
                className="w-full appearance-none rounded-[10px] border bg-[#faf8f8] px-3 py-2 text-[#413F3F] focus:outline-none"
              >
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
              </select>
              <img
                src={arrowImg}
                alt="arrow"
                className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 opacity-60"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="rounded-[8px] bg-[#E3DBDB] px-4 py-2 transition hover:bg-[#B1A0A0]"
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
