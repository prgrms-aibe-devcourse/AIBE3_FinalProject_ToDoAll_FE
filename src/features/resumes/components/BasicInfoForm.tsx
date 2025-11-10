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
    <section className="bg-white p-6 shadow-md rounded-2xl mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* 왼쪽 */}
        <div className="flex-1 grid grid-cols-1 gap-4">
          <div className="flex gap-4">
            <input
              className="border p-2 rounded-[10px] w-46 px-4"
              placeholder="이름"
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
            <div className="relative w-[92px]">
              <select
                className="border py-2 px-4 rounded-[10px] w-full appearance-none bg-white"
                value={formData.gender}
                onChange={(e) => onChange('gender', e.target.value as '남' | '여')}
              >
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
              <img
                src={vectorImg}
                alt="dropdown"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-2 pointer-events-none"
              />
            </div>

            <input
              type="date"
              className="border p-2 rounded-[10px] w-46 px-4"
              value={formData.birth}
              onChange={(e) => onChange('birth', e.target.value)}
            />
          </div>

          <input
            className="border p-2 rounded-[10px] w-46 px-4"
            placeholder="이메일"
            value={formData.email}
            onChange={(e) => onChange('email', e.target.value)}
          />

          <input
            className="border p-2 rounded-[10px] w-46 px-4"
            placeholder="연락처"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />

          <div className="flex gap-4">
            <input
              className="border p-2 rounded-[10px] w-46 px-4"
              placeholder="주소"
              value={formData.address.detail}
              onChange={(e) => onChange('address', { ...formData.address, detail: e.target.value })}
            />

            <input
              className="border p-2 rounded-[10px] w-46 px-4"
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

        {/* 오른쪽 */}
        <div className="w-48 h-48 flex-shrink-0">
          <label className="block w-full h-full border rounded-lg overflow-hidden cursor-pointer">
            {formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="이미지 추가"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
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
