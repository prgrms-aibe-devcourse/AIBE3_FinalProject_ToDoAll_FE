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
      <div className="flex items-center justify-between border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold">경력</h2>
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
        {formData.career?.map((item, idx) => (
          <div key={idx} className="flex flex-wrap gap-2 border-b border-[#837C7C] p-2">
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
        <div className="space-y-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              className="w-48 rounded-[10px] border px-3 py-2"
              placeholder="회사명"
              value={newCareer.company}
              onChange={(e) => setNewCareer({ ...newCareer, company: e.target.value })}
            />
            <input
              type="month"
              className="w-36 rounded-[10px] border p-2"
              value={newCareer.startDate}
              onChange={(e) => setNewCareer({ ...newCareer, startDate: e.target.value })}
            />
            <input
              type="month"
              className="w-36 rounded-[10px] border p-2"
              value={newCareer.endDate}
              onChange={(e) => setNewCareer({ ...newCareer, endDate: e.target.value })}
            />
            <input
              className="w-36 rounded-[10px] border px-3 py-2"
              placeholder="직무"
              value={newCareer.job}
              onChange={(e) => setNewCareer({ ...newCareer, job: e.target.value })}
            />
            <input
              className="w-36 rounded-[10px] border px-3 py-2"
              placeholder="근무부서"
              value={newCareer.department}
              onChange={(e) => setNewCareer({ ...newCareer, department: e.target.value })}
            />
            <input
              className="w-36 rounded-[10px] border px-3 py-2"
              placeholder="직급/직책"
              value={newCareer.position}
              onChange={(e) => setNewCareer({ ...newCareer, position: e.target.value })}
            />
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              className="rounded-[8px] bg-[#E3DBDB] px-4 py-2 transition hover:bg-[#B1A0A0]"
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
