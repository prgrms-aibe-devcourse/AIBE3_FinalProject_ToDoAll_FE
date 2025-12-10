import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import type { Skill } from '../types/resumes.types';
import CustomSelect from './CustomSelect';

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

            {/* CustomSelect 사용 */}
            <CustomSelect
              value={skillInput.level}
              onChange={(val) =>
                setSkillInput({ ...skillInput, level: val as '초급' | '중급' | '고급' })
              }
              options={[
                { value: '초급', label: '초급' },
                { value: '중급', label: '중급' },
                { value: '고급', label: '고급' },
              ]}
              className="w-36"
            />
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
