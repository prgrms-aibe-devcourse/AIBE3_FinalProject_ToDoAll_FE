interface InterviewActionsProps {
  status: '전체' | '예정' | '완료' | '진행중';
}

export default function InterviewActions({ status }: InterviewActionsProps) {
  if (status === '진행중') {
    return (
      <div className="flex justify-center gap-4">
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          질문 세트 생성
        </button>
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          이력서 열람
        </button>
      </div>
    );
  }

  if (status === '예정') {
    return (
      <div className="flex justify-center gap-4">
        <button className="bg-[#E35B43] text-white font-semibold px-5 py-2 rounded-lg hover:bg-[#d44f3a]">
          질문 세트 생성
        </button>
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          이력서 열람
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <button className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-purple-700">
        면접 노트
      </button>
      <button className="bg-green-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-700">
        등록 완료
      </button>
    </div>
  );
}
