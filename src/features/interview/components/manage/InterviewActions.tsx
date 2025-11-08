import { type InterviewStatus } from '../../types/interviewer';

interface InterviewActionsProps {
  status: InterviewStatus;
}

export default function InterviewActions({ status }: InterviewActionsProps) {
  if (status === '예정') {
    return (
      <div className="flex justify-center gap-4">
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          질문 세트 생성
        </button>
        {/* 질문 세트가 있는 경우 질문 세트 보기 */}
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          이력서 열람
        </button>
      </div>
    );
  }

  if (status === '미정') {
    return (
      <div className="flex justify-center gap-4">
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          면접 노트
        </button>
        {/* 질문 세트가 있는 경우 질문 세트 보기 */}
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          결과 등록
        </button>
      </div>
    );
  }

  if (status === '합격' || status === '보류' || status === '불합격') {
    return (
      <div className="flex justify-center gap-4">
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          면접 노트
        </button>
        {/* 질문 세트가 있는 경우 질문 세트 보기 */}
        <button className="text-gray-100 bg-green-500 font-semibold px-5 py-2 rounded-lg hover:bg-green-400">
          등록 완료
        </button>
      </div>
    );
  }

  if (status === '진행중') {
    return (
      <div className="flex justify-center gap-4">
        <button className="bg-purple-900 text-white font-semibold px-5 py-2 rounded-lg  hover:bg-purple-700">
          면접 시작
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-4">
      <button className="bg-purple-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-purple-700">
        면접 노트
      </button>
      <button className="bg-green-300 text-white font-semibold px-5 py-2 rounded-lg hover:bg-green-200">
        등록 완료
      </button>
    </div>
  );
}
