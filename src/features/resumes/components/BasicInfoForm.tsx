import type { ResumeData } from '../types/resumes.types';
import vectorImg from '../../../assets/Vector.png';

type Props = {
  formData: ResumeData;

  onChange: (
    // eslint-disable-next-line no-unused-vars
    field: keyof ResumeData,
    // eslint-disable-next-line no-unused-vars
    value: string | string[] | ResumeData['files'] | ResumeData['address'] | '남' | '여' | boolean
  ) => void;
};

export default function BasicInfoForm({ formData, onChange }: Props) {
  return (
    <section className="mb-6 rounded-2xl bg-white p-6 shadow-md">
      <div className="flex flex-col gap-6 md:flex-row">
        <div className="grid flex-1 grid-cols-1 gap-4">
          <div className="flex gap-4">
            <input
              className="w-46 rounded-[10px] border p-2 px-4"
              placeholder="이름"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
            <div className="relative w-[92px]">
              <select
                className="w-full appearance-none rounded-[10px] border bg-white px-4 py-2"
                value={formData.gender}
                onChange={(e) => onChange('gender', e.target.value as '남' | '여')}
              >
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
              <img
                src={vectorImg}
                alt="dropdown"
                className="pointer-events-none absolute top-1/2 right-2 h-2 w-3 -translate-y-1/2"
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

          <div className="flex gap-4">
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

        <div className="h-48 w-48 flex-shrink-0">
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
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = () => {
                    onChange('profileImage', reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
      </div>
    </section>
  );
}
