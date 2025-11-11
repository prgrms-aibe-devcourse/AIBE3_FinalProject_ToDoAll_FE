import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import type { ResumeData, CareerItem } from '../types/resumes.types';

type Props = {
  formData: ResumeData;
  onChange: (_field: keyof ResumeData, _value: CareerItem[]) => void;
};

export default function CareerForm({ formData, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newCareer, setNewCareer] = useState<CareerItem>({
    company: '',
    startDate: '',
    endDate: '',
    position: '',
    department: '',
    job: '',
  });

  const addCareer = () => {
    const { company, startDate, endDate, position, department, job } = newCareer;
    if (!company || !startDate || !endDate || !position || !department || !job) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    onChange('career', [...(formData.career ?? []), newCareer]);
    setShowForm(false);
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
    <>
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">경력</h2>
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
        {formData.career?.map((item, idx) => (
          <div key={idx} className="flex gap-2 flex-wrap p-2 border-b border-[#837C7C]">
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

      {showForm && (
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
              value={newCareer.startDate}
              onChange={(e) => setNewCareer({ ...newCareer, startDate: e.target.value })}
            />
            <input
              type="month"
              className="border p-2 rounded-[10px] w-36"
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
              className="px-4 py-2 bg-[#E3DBDB] rounded-[8px] hover:bg-[#B1A0A0] transition"
              onClick={addCareer}
            >
              입력
            </button>
          </div>
        </div>
      )}
    </>
  );
}
