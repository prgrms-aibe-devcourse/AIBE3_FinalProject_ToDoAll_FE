import { useState } from 'react';
import { type InterviewStatus } from '../../types/interviewer';

interface InterviewActionsProps {
  status: InterviewStatus;
  name?: string;
  avatar?: string;
}

/**
 * 인터뷰 카드 하단 버튼 영역
 * - 상태별로 다른 버튼 세트 표시
 * - '미정'일 때 결과 등록 모달 표시
 */
export default function InterviewActions({ status, name, avatar }: InterviewActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  if (status === '예정') {
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

  if (status === '미정') {
    return (
      <>
        <div className="flex justify-center gap-4">
          <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
            면접 노트
          </button>
          <button
            onClick={handleOpenModal}
            className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200"
          >
            결과 등록
          </button>
        </div>
        {/* 결과 등록 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="relative bg-[#E3DBDB] rounded-2xl p-8 w-[90%] max-w-[600px] h-[300px] text-center shadow-xl flex flex-col items-center">
              {/* 닫기 버튼 */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>

              {/* ✅ 프로필 - 내부 상단 중앙 */}
              {avatar && (
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-full object-cover mt-2 mb-5 border-4 border-white shadow-md"
                />
              )}

              {/* 본문 */}
              <div className="flex flex-col items-center mt-2">
                <p className="font-medium text-gray-800 mb-8 text-lg">
                  {name ? `${name} 님의 면접 결과를 등록합니다` : '면접 결과를 등록합니다'}
                </p>

                {/* 결과 버튼 */}
                <div className="flex justify-center gap-6">
                  <button className="bg-white px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                    합격
                  </button>
                  <button className="bg-white px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                    보류
                  </button>
                  <button className="bg-white px-8 py-3 rounded-lg hover:bg-gray-50 font-semibold">
                    불합격
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (status === '합격' || status === '보류' || status === '불합격') {
    return (
      <div className="flex justify-center gap-4">
        <button className="bg-gray-100 text-gray-700 font-semibold px-5 py-2 rounded-lg hover:bg-gray-200">
          면접 노트
        </button>
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
