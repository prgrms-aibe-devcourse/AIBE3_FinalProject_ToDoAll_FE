import type { ResumeData, EducationItem, CareerItem } from '../types/resumes.types';
import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import dropImg from '../../../assets/Vector.png';
import purplePlusImg from '../../../assets/Vector-3.png';
import TagSection from './TagForm';

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
      | CareerItem[]
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

  const [showFileForm, setShowFileForm] = useState(false);
  const [newFile, setNewFile] = useState<{ name: string; file?: File }>({ name: '' });

  const [showCareerForm, setShowCareerForm] = useState(false);
  const [newCareer, setNewCareer] = useState<CareerItem>({
    company: '',
    startDate: '',
    endDate: '',
    position: '',
    department: '',
    job: '',
  });

  // 학력 구분 변경
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

  // 파일 추가
  const addFile = () => {
    if (!newFile.file) {
      alert('파일을 선택해주세요.');
      return;
    }
    const currentEtc = formData.files.etc ?? [];
    const displayName = newFile.name?.trim() || newFile.file.name;
    const updatedFiles = {
      ...formData.files,
      etc: [...currentEtc, displayName],
    };
    onChange('files', updatedFiles);
    setShowFileForm(false);
    setNewFile({ name: '', file: undefined });
  };

  // 경력 추가
  const addCareer = () => {
    const { company, startDate, endDate, position, department, job } = newCareer;
    if (!company || !startDate || !endDate || !position || !department || !job) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    onChange('career', [...(formData.career ?? []), newCareer]);
    setShowCareerForm(false);
    setNewCareer({
      company: '',
      startDate: '',
      endDate: '',
      position: '',
      department: '',
      job: '',
    });
  };

  return (
    <section className="bg-white p-6 space-y-6 mt-6 rounded-[10px] shadow-sm text-[#413F3F]">
      {/* 포트폴리오/기타문서 */}
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#413F3F]">포트폴리오 및 기타문서</h2>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          className="flex items-center gap-2 border rounded-[10px] px-4 py-2 text-[#752F6D] hover:bg-[#F3EAF7] transition"
          onClick={() => setShowFileForm(!showFileForm)}
        >
          <img src={purplePlusImg} alt="plusPerple" className="w-4 h-4" />
          포트폴리오 및 기타문서 추가
        </button>
      </div>

      {showFileForm && (
        <div className="p-4 rounded-[10px] space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,.docx,.pptx,.zip,.jpg,.png"
              className="border p-2 rounded-[10px] text-[#413F3F] flex-[40px]"
              onChange={(e) => setNewFile({ ...newFile, file: e.target.files?.[0] })}
            />
            <button
              type="button"
              className="px-4 py-2 bg-[#E3DBDB] text-[#413F3F] rounded-[8px] hover:bg-[#B1A0A0] transition"
              onClick={addFile}
            >
              추가
            </button>
          </div>
        </div>
      )}

      {((formData.files.etc && formData.files.etc.length > 0) || formData.files.portfolio) && (
        <div className="bg-white border border-[#E5E5E5] rounded-[10px] p-4 -mt-2">
          <div className="text-sm text-[#413F3F] font-medium mb-2">첨부된 파일</div>
          <ul className="list-disc pl-5 space-y-1 text-sm text-[#413F3F]">
            {formData.files.portfolio ? <li>{formData.files.portfolio}</li> : null}
            {formData.files.etc?.map((name, i) => (
              <li key={name + i}>{name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 학력 */}
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
        {formData.education.map((edu: EducationItem, idx: number) => (
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

      {showEduForm && (
        <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-[10px] border border-[#E5E5E5]">
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

          {newEdu.type && (
            <>
              <div className="flex flex-wrap gap-3 items-center mt-2">
                <input
                  className="border py-2 px-3 rounded-[10px] w-48 text-[#413F3F]"
                  placeholder="학교명"
                  value={newEdu.name ?? ''}
                  onChange={(e) => setNewEdu({ ...newEdu, name: e.target.value })}
                />
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
                <label className="flex items-center gap-2 h-full">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-purple-600"
                    checked={newEdu.graduated ?? false}
                    onChange={(e) => setNewEdu({ ...newEdu, graduated: e.target.checked })}
                  />
                  <span className="text-[#413F3F]">졸업</span>
                </label>

                {(newEdu.type === '대학' || newEdu.type === '대학원') && (
                  <>
                    <input
                      className="border p-2 rounded-[10px] w-48 text-[#413F3F]"
                      placeholder="전공"
                      value={
                        (newEdu as Extract<EducationItem, { type: '대학' | '대학원' }>).major ?? ''
                      }
                      onChange={(e) =>
                        setNewEdu({ ...newEdu, major: e.target.value } as EducationItem)
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

              <div className="flex justify-end mt-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-[#E3DBDB] text-[#413F3F] rounded-[8px] hover:bg-[#B1A0A0] transition"
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

      {/* 경력 */}
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#413F3F]">경력</h2>
        <button
          type="button"
          className="px-3 py-1 text-[#413F3F] flex items-center gap-1 hover:opacity-80 transition"
          onClick={() => setShowCareerForm(true)}
        >
          <img src={plusImg} alt="plus" className="w-3 h-3" />
          추가
        </button>
      </div>

      {/* 경력 리스트 */}
      <div>
        {formData.career?.map((item: CareerItem, idx: number) => (
          <div
            key={idx}
            className="flex gap-2 flex-wrap p-2 border-b last:border-b-0 border-[#837C7C] text-[#413F3F]"
          >
            <span className="font-medium">{item.company}</span>
            <span>
              {item.startDate} ~ {item.endDate}
            </span>
            <span>{item.position}</span>
            <span>{item.department}</span>
            <span>{item.job}</span>
          </div>
        ))}
      </div>

      {/* 경력 입력 폼 */}
      {showCareerForm && (
        <div className="space-y-3 bg-[#FAFAFA] p-4 rounded-[10px] border border-[#E5E5E5]">
          <div className="flex flex-wrap gap-3 items-center mt-2">
            <input
              className="border py-2 px-3 rounded-[10px] w-48"
              placeholder="회사명"
              value={newCareer.company}
              onChange={(e) => setNewCareer({ ...newCareer, company: e.target.value })}
            />
            <input
              type="month"
              className="border p-2 rounded-[10px] w-36"
              placeholder="입사년월"
              value={newCareer.startDate}
              onChange={(e) => setNewCareer({ ...newCareer, startDate: e.target.value })}
            />
            <input
              type="month"
              className="border p-2 rounded-[10px] w-36"
              placeholder="퇴사년월"
              value={newCareer.endDate}
              onChange={(e) => setNewCareer({ ...newCareer, endDate: e.target.value })}
            />
            <input
              className="border py-2 px-3 rounded-[10px] w-36"
              placeholder="직무"
              value={newCareer.job}
              onChange={(e) => setNewCareer({ ...newCareer, job: e.target.value })}
            />
            <input
              className="border py-2 px-3 rounded-[10px] w-36"
              placeholder="근무부서"
              value={newCareer.department}
              onChange={(e) => setNewCareer({ ...newCareer, department: e.target.value })}
            />
            <input
              className="border py-2 px-3 rounded-[10px] w-36"
              placeholder="직급/직책"
              value={newCareer.position}
              onChange={(e) => setNewCareer({ ...newCareer, position: e.target.value })}
            />
          </div>
          <div className="flex justify-end mt-3">
            <button
              type="button"
              className="px-4 py-2 bg-[#E3DBDB] text-[#413F3F] rounded-[8px] hover:bg-[#B1A0A0] transition"
              onClick={addCareer}
            >
              입력
            </button>
          </div>
        </div>
      )}

      <TagSection
        title="스킬"
        tags={formData.skills}
        onChange={(updated) => onChange('skills', updated)}
      />

      <TagSection
        title="경험/활동/교육"
        tags={formData.experience ? formData.experience.split(',') : []} // 문자열을 배열로 변환
        onChange={(updated) => onChange('experience', updated.join(','))} // 배열을 다시 문자열로 저장
      />

      <TagSection
        title="자격/어학/수상"
        tags={formData.certifications ? formData.certifications.split(',') : []}
        onChange={(updated) => onChange('certifications', updated.join(','))}
      />
    </section>
  );
}
