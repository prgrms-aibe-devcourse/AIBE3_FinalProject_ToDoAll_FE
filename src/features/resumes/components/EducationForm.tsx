import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import type { ResumeData, EducationItem } from '../types/resumes.types';
import CustomSelect from './CustomSelect';

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
        universityType: '',
        name: '',
        transferred: false,
        major: '',
        graduated: false,
        startDate: '',
        endDate: '',
        dayTime: 'DAY',
        grade: '',
        maxGrade: '',
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

  const displayDayTime = (value: 'DAY' | 'NIGHT') => (value === 'DAY' ? '주간' : '야간');

  return (
    <>
      <div className="flex items-center justify-between border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold text-[#413F3F]">최종 학력 사항</h2>
        <button
          type="button"
          className="flex items-center gap-1 px-3 py-1 text-[#413F3F] transition hover:opacity-80"
          onClick={() => setShowForm(true)}
        >
          <img src={plusImg} alt="plus" className="h-3 w-3" />
          추가
        </button>
      </div>

      <div>
        {formData.education.map((edu, idx) => (
          <div key={idx} className="flex flex-wrap gap-2 border-b border-[#837C7C] p-2">
            <span className="font-medium">{edu.type}</span>
            <span>{edu.name}</span>
            <span>
              {edu.startDate} ~ {edu.endDate}
            </span>
            <span>{edu.graduated ? '졸업' : '재학'}</span>

            {edu.type === '대학' || edu.type === '대학원' ? (
              <>
                <span>{displayDayTime(edu.dayTime)}</span>
                {edu.grade && edu.maxGrade && (
                  <span>
                    {edu.grade} / {edu.maxGrade}
                  </span>
                )}
              </>
            ) : null}
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <CustomSelect
            className="w-55"
            value={newEdu.type ?? ''}
            onChange={(v) => handleTypeChange(v as EducationItem['type'])}
            options={[
              { value: '초등학교', label: '초등학교 졸업' },
              { value: '중학교', label: '중학교 졸업' },
              { value: '고등학교', label: '고등학교 졸업' },
              { value: '대학', label: '대학 · 대학원 이상 졸업' },
              { value: '대학원', label: '대학원 졸업' },
            ]}
            placeholder="학력 구분 선택"
          />

          {newEdu.type && (
            <>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <input
                  className="w-48 rounded-[10px] border px-3 py-2"
                  placeholder="학교명"
                  value={newEdu.name ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, name: e.target.value })}
                />

                <input
                  type="date"
                  className="w-36 rounded-[10px] border p-2"
                  value={newEdu.startDate ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                />

                <input
                  type="date"
                  className="w-36 rounded-[10px] border p-2"
                  value={newEdu.endDate ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-purple-600"
                    checked={newEdu.graduated ?? false}
                    onChange={(e) => setNewEdu({ ...newEdu, graduated: e.target.checked })}
                  />
                  <span>졸업</span>
                </label>
              </div>

              {(newEdu.type === '대학' || newEdu.type === '대학원') && (
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <CustomSelect
                    className="w-28"
                    value={newEdu.dayTime ?? 'DAY'}
                    onChange={(v) =>
                      setNewEdu({
                        ...newEdu,
                        dayTime: v as 'DAY' | 'NIGHT',
                      })
                    }
                    options={[
                      { value: 'DAY', label: '주간' },
                      { value: 'NIGHT', label: '야간' },
                    ]}
                  />
                  <input
                    className="w-32 rounded-[10px] border px-3 py-2"
                    placeholder="전공"
                    value={newEdu.major ?? ''}
                    onChange={(e) => setNewEdu({ ...newEdu, major: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-24 rounded-[10px] border px-3 py-2"
                    placeholder="학점"
                    value={newEdu.grade ?? ''}
                    onChange={(e) => setNewEdu({ ...newEdu, grade: e.target.value })}
                  />
                  <input
                    type="number"
                    className="w-28 rounded-[10px] border px-3 py-2"
                    placeholder="기준학점"
                    value={newEdu.maxGrade ?? ''}
                    onChange={(e) => setNewEdu({ ...newEdu, maxGrade: e.target.value })}
                  />
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="rounded-[8px] bg-[#E3DBDB] px-4 py-2 transition hover:bg-[#B1A0A0]"
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
