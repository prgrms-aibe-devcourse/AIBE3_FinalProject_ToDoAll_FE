export default function ApplicantProfileCard() {
  return (
    <div className="mt-16 flex flex-col items-center rounded-xl bg-[#d8cfcc] p-6 shadow-md">
      <img
        src="https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg"
        alt="김잡다"
        className="mb-6 h-36 w-36 rounded-full object-cover"
      />
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold">김잡다</h2>
        <p className="mb-6 text-sm text-gray-500">잡다컴퍼니 백엔드 개발자 채용</p>

        <div className="space-y-2 text-left text-sm text-gray-700">
          <p>
            <span className="inline-block w-20 font-semibold text-gray-500">생년월일</span>
            1997.04.03 (만 29세)
          </p>
          <p>
            <span className="inline-block w-20 font-semibold text-gray-500">email</span>
            jobda1@gmail.com
          </p>
          <p>
            <span className="inline-block w-20 font-semibold text-gray-500">전화번호</span>
            010-1234-5678
          </p>
        </div>
      </div>
    </div>
  );
}
