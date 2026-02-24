import { useState } from 'react';
import type { ResumeData } from '../types/resumes.types';
import CustomSelect from './CustomSelect';
import AlertModal from '@shared/components/Alertmodal.tsx';

type Props = {
  formData: ResumeData;
  onChange: <K extends keyof ResumeData>(_field: K, _value: ResumeData[K]) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function BasicInfoForm({ formData, onChange }: Props) {
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string>('');

  const checkFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeError(`${fileSizeMB}MB`);
      setShowSizeWarning(true);
      return false;
    }
    return true;
  };
  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-md">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="grid flex-1 grid-cols-1 gap-4">
          <div className="flex flex-wrap gap-4">
            <input
              className="w-46 rounded-[10px] border p-2 px-4"
              placeholder="이름"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
            />

            <div className="w-[92px]">
              <CustomSelect
                value={formData.gender}
                onChange={(val) => onChange('gender', val as '남' | '여')}
                options={[
                  { value: '남', label: '남' },
                  { value: '여', label: '여' },
                ]}
              />
            </div>

            <input
              type="date"
              className="w-46 rounded-[10px] border p-2 px-4"
              value={formData.birth}
              onChange={(e) => onChange('birth', e.target.value)}
            />
          </div>

          <input
            className="w-46 rounded-[10px] border p-2 px-4"
            placeholder="이메일"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
          />

          <input
            className="w-46 rounded-[10px] border p-2 px-4"
            placeholder="연락처"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />

          <div className="flex flex-wrap gap-4">
            <input
              className="w-46 rounded-[10px] border p-2 px-4"
              placeholder="주소"
              value={formData.address.detail}
              onChange={(e) => onChange('address', { ...formData.address, detail: e.target.value })}
            />

            <input
              className="w-46 rounded-[10px] border p-2 px-4"
              placeholder="상세주소"
              value={formData.address.city}
              onChange={(e) => onChange('address', { ...formData.address, city: e.target.value })}
            />

            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={formData.address.country !== '대한민국'}
                onChange={(e) =>
                  onChange('address', {
                    ...formData.address,
                    country: e.target.checked ? '해외' : '대한민국',
                  })
                }
              />
              해외지역
            </label>
          </div>
        </div>

        <div className="relative h-48 w-48 flex-shrink-0">
          <label className="block h-full w-full cursor-pointer overflow-hidden rounded-lg border">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="이미지 추가"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-gray-400">
                <span className="text-[20px]">+</span>
                <span>이미지 추가</span>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                if (!checkFileSize(file)) {
                  e.currentTarget.value = '';
                  return;
                }

                const reader = new FileReader();
                reader.onload = () => {
                  onChange('profileImage', reader.result as string);
                };
                reader.readAsDataURL(file);

                onChange('files', {
                  resume: file,
                  resumeName: file.name,
                  resumeKey: '',
                } as any);

                e.currentTarget.value = '';
              }}
            />
          </label>
          {formData.profileImage && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange('profileImage', '');
                onChange('files', {
                  resume: null,
                  resumeName: '',
                  resumeKey: '',
                } as any);
              }}
              className="text absolute top-1 right-1 rounded-full p-1 transition hover:text-[#DE4F36]"
              aria-label="이미지 삭제"
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
          )}
        </div>
      </div>

      <AlertModal
        open={showSizeWarning}
        type="warning"
        title="파일 크기 초과"
        message={`파일 크기가 5MB를 초과합니다.\n\n선택한 파일 크기: ${fileSizeError}\n최대 허용 크기: 5MB\n\n5MB 이하의 파일을 선택해주세요.`}
        onClose={() => {
          setShowSizeWarning(false);
          setFileSizeError('');
        }}
        confirmText="확인"
      />
    </section>
  );
}
