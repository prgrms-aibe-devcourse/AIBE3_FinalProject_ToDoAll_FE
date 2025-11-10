import type { ResumeData, EducationItem } from '../types/resumes.types';
import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import dropImg from '../../../assets/Vector.png';

type Props = {
  formData: ResumeData;

  onChange: (
    _field: keyof ResumeData,
    _value:
      | string
      | boolean
      | string[]
      | ResumeData['files']
      | ResumeData['address']
      | '남'
      | '여'
      | EducationItem[]
  ) => void;
};

export default function ResumeForm({ formData, onChange }: Props) {
  const [showEduForm, setShowEduForm] = useState(false);
  const [newEdu, setNewEdu] = useState<Partial<EducationItem>>({
    type: undefined,
    name: '',
    graduated: false,
    startDate: '',
    endDate: '',
  });

  // 학력 구분 변경 시
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

  // 학력 추가
  const addEducation = () => {
    if (!newEdu.type || !newEdu.name || !newEdu.startDate || !newEdu.endDate) {
      alert('학력 구분, 학교명, 입학일, 졸업일을 모두 입력해주세요.');
      return;
    }
    onChange('education', [...formData.education, newEdu as EducationItem]);
    setShowEduForm(false);
    setNewEdu({
      type: undefined,
      name: '',
      graduated: false,
      startDate: '',
      endDate: '',
    });
  };

  return (
    <section className="bg-white p-6 space-y-6 mt-6 rounded-[10px] shadow-sm text-[#413F3F]">
      {/* 헤더 */}
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#413F3F]">최종 학력 사항</h2>
        <button
          type="button"
          className="px-3 py-1 text-[#413F3F] flex items-center gap-1 hover:opacity-80 transition"
          onClick={() => setShowEduForm(true)}
        >
          <img src={plusImg} alt="plus" className="w-3 h-3" />
          추가
        </button>
      </div>

      {/* 학력 리스트 */}
      <div>
        {formData.education.map((edu, idx) => (
          <div
            key={idx}
            className="flex gap-2 flex-wrap p-2 border-b last:border-b-0 border-[#837C7C] text-[#413F3F]"
          >
            <span className="font-medium">{edu.type}</span>
            <span>{edu.name}</span>
            <span>
              {edu.startDate} ~ {edu.endDate}
            </span>
            <span>{edu.graduated ? '졸업' : '재학'}</span>
          </div>
        ))}
      </div>

      {/* 학력 입력 폼 */}
      {showEduForm && (
        <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-[10px] border border-[#E5E5E5]">
          {/* 학력 구분 */}
          <div className="relative w-40">
            <select
              className="border px-3 py-2 pr-10 rounded-[10px] w-full appearance-none shadow-none outline-none text-[#413F3F]"
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

          {/* 학력 구분 선택 시 입력 폼 */}
          {newEdu.type && (
            <>
              <div className="flex flex-wrap gap-3 items-center">
                {/* 학교명 */}
                <input
                  className="border py-2 px-3 rounded-[10px] w-48 text-[#413F3F]"
                  placeholder="학교명"
                  value={newEdu.name ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, name: e.target.value })}
                />

                {/* 입학일, 졸업일 */}
                <input
                  type="date"
                  className="border p-2 rounded-[10px] w-36 text-[#413F3F]"
                  value={newEdu.startDate ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="border p-2 rounded-[10px] w-36 text-[#413F3F]"
                  value={newEdu.endDate ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, endDate: e.target.value })}
                />

                {/* 졸업 여부 */}
                <label className="flex items-center gap-2 h-full">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-600"
                    checked={newEdu.graduated ?? false}
                    onChange={(e) => setNewEdu({ ...newEdu, graduated: e.target.checked })}
                  />
                  <span className="text-[#413F3F]">졸업</span>
                </label>

                {/* 대학/대학원일 경우 추가 항목 */}
                {(newEdu.type === '대학' || newEdu.type === '대학원') && (
                  <>
                    <input
                      className="border p-2 rounded-[10px] w-48 text-[#413F3F]"
                      placeholder="전공"
                      value={
                        (newEdu as Extract<EducationItem, { type: '대학' | '대학원' }>).major ?? ''
                      }
                      onChange={(e) =>
                        setNewEdu({
                          ...newEdu,
                          major: e.target.value,
                        } as EducationItem)
                      }
                    />

                    <select
                      className="border p-2 rounded-[10px] w-28 text-[#413F3F]"
                      value={
                        (newEdu as Extract<EducationItem, { type: '대학' | '대학원' }>).dayTime ??
                        '주간'
                      }
                      onChange={(e) =>
                        setNewEdu({
                          ...newEdu,
                          dayTime: e.target.value as '주간' | '야간',
                        } as EducationItem)
                      }
                    >
                      <option value="주간">주간</option>
                      <option value="야간">야간</option>
                    </select>
                  </>
                )}
              </div>

              {/* 입력 버튼 */}
              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                  disabled={!newEdu.type || !newEdu.name || !newEdu.startDate || !newEdu.endDate}
                  onClick={addEducation}
                >
                  입력
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
