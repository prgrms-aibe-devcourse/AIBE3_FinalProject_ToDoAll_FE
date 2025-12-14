import { userDefaultImage } from '@/const.ts';

interface ApplicantProfile {
  applicant: {
    name: string;
    email: string;
    phoneNumber?: string;
    birthDate?: string; // yyyy-MM-dd
    avatar?: string;
    jdTitle?: string; // 지원한 공고명
  };
}

export default function ApplicantProfileCard({ applicant }: ApplicantProfile) {
  const { name, email, phoneNumber, birthDate, avatar, jdTitle } = applicant;

  return (
    <div className="mt-16 flex flex-col items-center rounded-xl bg-[#d8cfcc] p-6 shadow-md">
      <img
        src={avatar ?? userDefaultImage}
        alt={name}
        className="mb-6 h-36 w-36 rounded-full object-cover"
      />
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold">{name}</h2>
        <p className="mb-6 text-sm text-gray-500">{jdTitle ?? '지원 공고 정보 없음'}</p>

        <div className="space-y-2 text-left text-sm text-gray-700">
          <p>
            <span className="inline-block w-20 font-semibold text-gray-500">생년월일</span>
            {birthDate ?? '정보 없음'}
          </p>
          <p>
            <span className="inline-block w-20 font-semibold text-gray-500">email</span>
            {email}
          </p>
          <p>
            <span className="inline-block w-20 font-semibold text-gray-500">전화번호</span>
            {phoneNumber ?? '정보 없음'}
          </p>
        </div>
      </div>
    </div>
  );
}
