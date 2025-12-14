import React, { useState, useEffect } from 'react';
import type { Skill } from '../types/resumes.types';
import CustomSelect from './CustomSelect';
import { Pill } from '../../jd/components/shared/Pill';
import { fetchSkills } from '../../jd/services/jobApi';

export default function SkillFormSection({
  skills,
  onChange,
}: {
  skills: Skill[];
  onChange: (_updated: Skill[]) => void;
}) {
  const [skillNameDraft, setSkillNameDraft] = useState('');
  const [levelDraft, setLevelDraft] = useState<'초급' | '중급' | '고급'>('초급');
  const [open, setOpen] = useState(false);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);

  // 스킬 옵션 로드
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await fetchSkills();
        setSkillOptions(data.map((s) => s.name));
      } catch (err) {
        console.error('fetchSkills error:', err);
      }
    };
    loadSkills();
  }, []);

  const normalize = (s: string) => s.trim().toLowerCase();

  const addSkill = (name: string, level: '초급' | '중급' | '고급') => {
    const trimmedName = name.trim();
    if (!trimmedName) return;
    // 중복 체크
    if (skills.some((s) => normalize(s.name) === normalize(trimmedName))) return;
    onChange([...skills, { name: trimmedName, level }]);
    setSkillNameDraft('');
    setLevelDraft('초급');
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, idx) => idx !== index));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillNameDraft, levelDraft);
      setOpen(false);
    }
    if (e.key === 'Backspace' && !skillNameDraft && skills.length) {
      removeSkill(skills.length - 1);
    }
  };

  const filteredOptions = skillOptions
    .filter((opt) => !skills.some((s) => normalize(s.name) === normalize(opt)))
    .filter((opt) => normalize(opt).includes(normalize(skillNameDraft)));

  return (
    <>
      <div className="border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold">스킬</h2>
      </div>

      <div className="p-4">
        <div className="relative mb-4">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[#E0E0E0] bg-[#FAF8F8] p-2">
            <input
              value={skillNameDraft}
              onChange={(e) => {
                setSkillNameDraft(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                setTimeout(() => setOpen(false), 100);
              }}
              onKeyDown={onKeyDown}
              placeholder="스킬 이름 입력 (Enter 또는 , 로 추가)"
              className="text-m min-w-[120px] flex-1 border-none bg-transparent px-2 py-1 focus:outline-none"
            />
            <div className="flex items-center gap-2">
              <CustomSelect
                value={levelDraft}
                onChange={(val) => setLevelDraft(val as '초급' | '중급' | '고급')}
                options={[
                  { value: '초급', label: '초급' },
                  { value: '중급', label: '중급' },
                  { value: '고급', label: '고급' },
                ]}
                className="w-24"
              />
            </div>
          </div>
          {open && filteredOptions.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow">
              {filteredOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="flex w-full px-3 py-1.5 text-left text-sm hover:bg-gray-100"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    addSkill(opt, levelDraft);
                    setOpen(false);
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, idx) => (
            <Pill key={`${skill.name}-${idx}`} className="bg-white">
              <span className="mr-1 font-medium">{skill.name}</span>
              <span className="mr-1 text-gray-500">({skill.level})</span>
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="-mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label={`${skill.name} 제거`}
              >
                ×
              </button>
            </Pill>
          ))}
        </div>
      </div>
    </>
  );
}
