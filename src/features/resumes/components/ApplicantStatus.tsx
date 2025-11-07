export default function ApplicantStatus() {
  return (
    <div className="flex items-center justify-between border rounded-lg p-4 w-96">
      <div>
        <h3 className="text-lg font-semibold">김지원</h3>
        <p className="text-gray-500 text-sm">Frontend Developer 지원자</p>
      </div>

      <div className="flex gap-2">
        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg">
          합격
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg">
          불합격
        </button>
      </div>
    </div>
  );
}
