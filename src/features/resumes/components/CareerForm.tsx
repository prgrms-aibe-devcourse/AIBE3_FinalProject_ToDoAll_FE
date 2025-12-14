import { useState } from 'react';
import plusImg from '../../../assets/Vector-2.png';
import type { ResumeData, CareerItem } from '../types/resumes.types';
import AlertModal from '../../../components/Alertmodal';

type Props = {
  formData: ResumeData;
  onChange: (_field: keyof ResumeData, _value: CareerItem[]) => void;
};
function getTodayDate() {
  const today = new Date();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export default function CareerForm({ formData, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [showDateWarning, setShowDateWarning] = useState(false);
  const [showRequiredWarning, setShowRequiredWarning] = useState(false);
  const [newCareer, setNewCareer] = useState<CareerItem>({
    company: '',
    startDate: getTodayDate(),
    endDate: getTodayDate(),
    position: '',
    department: '',
    job: '',
  });

  const addCareer = () => {
    const { company, startDate, endDate, position, department, job } = newCareer;
    if (!company || !startDate || !endDate || !position || !department || !job) {
      setShowRequiredWarning(true);
      return;
    }

    // 시작일이 종료일보다 나중인지 확인
    if (new Date(startDate) > new Date(endDate)) {
      setShowDateWarning(true);
      return;
    }

    onChange('career', [...(formData.career ?? []), newCareer]);
    setShowForm(false);
    setNewCareer({
      company: '',
      startDate: getTodayDate(),
      endDate: getTodayDate(),
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
          <div key={idx} className="relative flex flex-wrap gap-2 border-b border-[#837C7C] p-2">
            <span className="font-medium">{item.company}</span>
            <span>
              {item.startDate} ~ {item.endDate}
            </span>
            <span>{item.position}</span>
            <span>{item.department}</span>
            <span>{item.job}</span>
            <button
              type="button"
              onClick={() => {
                const updated = formData.career?.filter((_, i) => i !== idx) || [];
                onChange('career', updated);
              }}
              className="absolute top-1 right-1 rounded-full p-1 transition hover:text-[#DE4F36]"
              aria-label={`${item.company} 경력 삭제`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="space-y-3 rounded-[10px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
          <div className="flex flex-col">
            <label className="mb-1 text-sm text-gray-500">회사명</label>
            <input
              className="w-full rounded-[10px] border px-3 py-2"
              placeholder="회사명"
              value={newCareer.company}
              onChange={(e) => setNewCareer({ ...newCareer, company: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col">
              <label className="mb-1 text-sm text-gray-500">입사일</label>
              <input
                type="date"
                className="w-full rounded-[10px] border px-3 py-2"
                value={newCareer.startDate}
                onChange={(e) => setNewCareer({ ...newCareer, startDate: e.target.value })}
              />
            </div>

            <div className="flex flex-1 flex-col">
              <label className="mb-1 text-sm text-gray-500">퇴사일</label>
              <input
                type="date"
                className="w-full rounded-[10px] border px-3 py-2"
                value={newCareer.endDate}
                onChange={(e) => setNewCareer({ ...newCareer, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col">
              <label className="mb-1 text-sm text-gray-500">직무</label>
              <input
                className="w-full rounded-[10px] border px-3 py-2"
                placeholder="직무"
                value={newCareer.job}
                onChange={(e) => setNewCareer({ ...newCareer, job: e.target.value })}
              />
            </div>

            <div className="flex flex-1 flex-col">
              <label className="mb-1 text-sm text-gray-500">근무부서</label>
              <input
                className="w-full rounded-[10px] border px-3 py-2"
                placeholder="근무부서"
                value={newCareer.department}
                onChange={(e) => setNewCareer({ ...newCareer, department: e.target.value })}
              />
            </div>

            <div className="flex flex-1 flex-col">
              <label className="mb-1 text-sm text-gray-500">직급/직책</label>
              <input
                className="w-full rounded-[10px] border px-3 py-2"
                placeholder="직급/직책"
                value={newCareer.position}
                onChange={(e) => setNewCareer({ ...newCareer, position: e.target.value })}
              />
            </div>
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

      <AlertModal
        open={showDateWarning}
        type="warning"
        title="날짜 입력 오류"
        message="입사일은 퇴사일보다 이전이어야 합니다. 날짜를 확인해주세요."
        onClose={() => setShowDateWarning(false)}
        confirmText="확인"
      />

      <AlertModal
        open={showRequiredWarning}
        type="warning"
        title="입력 필수 항목"
        message="모든 항목을 입력해주세요."
        onClose={() => setShowRequiredWarning(false)}
        confirmText="확인"
      />
    </>
  );
}
