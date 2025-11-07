export default function ApplicantProfileCard() {
  return (
    <div className="bg-[#d8cfcc] rounded-xl p-6 mt-16 flex flex-col items-center shadow-md">
      <img
        src="https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg"
        alt="김잡다"
        className="w-36 h-36 rounded-full object-cover mb-6"
      />
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">김잡다</h2>
        <p className="text-sm text-gray-500 mb-6">잡다컴퍼니 백엔드 개발자 채용</p>

        <div className="text-left text-sm text-gray-700 space-y-2">
          <p>
            <span className="font-semibold w-20 inline-block text-gray-500">생년월일</span>
            1997.04.03 (만 29세)
          </p>
          <p>
            <span className="font-semibold w-20 inline-block text-gray-500">email</span>
            jobda1@gmail.com
          </p>
          <p>
            <span className="font-semibold w-20 inline-block text-gray-500">전화번호</span>
            010-1234-5678
          </p>
        </div>
      </div>
    </div>
  );
}
