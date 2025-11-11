import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import dropImg from '../../../assets/Vector.png';
import type { ResumeData, EducationItem } from '../types/resumes.types';

type Props = {
  formData: ResumeData;
  onChange: (_field: keyof ResumeData, _value: EducationItem[]) => void;
};

export default function EducationForm({ formData, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newEdu, setNewEdu] = useState<Partial<EducationItem>>({
    type: undefined,
    name: '',
    graduated: false,
    startDate: '',
    endDate: '',
  });

  const handleTypeChange = (type: EducationItem['type']) => {
    if (type === '대학' || type === '대학원') {
      setNewEdu({
        type,
        name: '',
        universityType: '',
        major: '',
        transferred: false,
        graduated: false,
        startDate: '',
        endDate: '',
        dayTime: '주간',
      });
    } else {
      setNewEdu({
        type,
        name: '',
        graduated: false,
        startDate: '',
        endDate: '',
      });
    }
  };

  const addEducation = () => {
    if (!newEdu.type || !newEdu.name || !newEdu.startDate || !newEdu.endDate) {
      alert('학력 구분, 학교명, 입학일, 졸업일을 모두 입력해주세요.');
      return;
    }
    onChange('education', [...formData.education, newEdu as EducationItem]);
    setShowForm(false);
    setNewEdu({
      type: undefined,
      name: '',
      graduated: false,
      startDate: '',
      endDate: '',
    });
  };

  return (
    <>
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#413F3F]">최종 학력 사항</h2>
        <button
          type="button"
          className="px-3 py-1 text-[#413F3F] flex items-center gap-1 hover:opacity-80 transition"
          onClick={() => setShowForm(true)}
        >
          <img src={plusImg} alt="plus" className="w-3 h-3" />
          추가
        </button>
      </div>

      <div>
        {formData.education.map((edu, idx) => (
          <div key={idx} className="flex gap-2 flex-wrap p-2 border-b border-[#837C7C]">
            <span className="font-medium">{edu.type}</span>
            <span>{edu.name}</span>
            <span>
              {edu.startDate} ~ {edu.endDate}
            </span>
            <span>{edu.graduated ? '졸업' : '재학'}</span>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-[10px] border border-[#E5E5E5]">
          <div className="relative w-40">
            <select
              className="border px-3 py-2 pr-10 rounded-[10px] w-full"
              value={newEdu.type ?? ''}
              onChange={(e) => handleTypeChange(e.target.value as EducationItem['type'])}
            >
              <option value="" disabled>
                학력 구분 선택
              </option>
              <option value="초등학교">초등학교</option>
              <option value="중학교">중학교</option>
              <option value="고등학교">고등학교</option>
              <option value="대학">대학</option>
              <option value="대학원">대학원</option>
            </select>
            <img
              src={dropImg}
              alt="drop-down"
              className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-3 h-2"
            />
          </div>

          {newEdu.type && (
            <>
              <div className="flex flex-wrap gap-3 items-center mt-2">
                <input
                  className="border py-2 px-3 rounded-[10px] w-48"
                  placeholder="학교명"
                  value={newEdu.name ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, name: e.target.value })}
                />
                <input
                  type="date"
                  className="border p-2 rounded-[10px] w-36"
                  value={newEdu.startDate ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="border p-2 rounded-[10px] w-36"
                  value={newEdu.endDate ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                />
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-600"
                    checked={newEdu.graduated ?? false}
                    onChange={(e) => setNewEdu({ ...newEdu, graduated: e.target.checked })}
                  />
                  <span>졸업</span>
                </label>
              </div>

              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#E3DBDB] rounded-[8px] hover:bg-[#B1A0A0] transition"
                  onClick={addEducation}
                >
                  입력
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
