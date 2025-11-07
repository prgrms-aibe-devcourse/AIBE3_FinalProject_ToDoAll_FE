import { useState } from 'react';

type InterviewStatus = '전체' | '예정' | '완료' | '진행중';

interface InterviewCard {
  id: number;
  name: string;
  position: string;
  date: string;
  time: string;
  interviewers: string;
  status: InterviewStatus;
  avatar: string;
}

export default function InterviewManagePage() {
  const [activeTab, setActiveTab] = useState<InterviewStatus>('전체');

  const interviews: InterviewCard[] = [
    {
      id: 1,
      name: '김철수',
      position: '시니어 프론트엔드 개발자 구합니다',
      date: '2025-12-01',
      time: '12:00',
      interviewers: '홍길동, 홍길순',
      status: '진행중',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 2,
      name: '김철수',
      position: '시니어 프론트엔드 개발자 구합니다',
      date: '2025-12-01',
      time: '12:00',
      interviewers: '홍길동, 홍길순',
      status: '완료',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 3,
      name: '김철수',
      position: '시니어 프론트엔드 개발자 구합니다',
      date: '2025-12-01',
      time: '12:00',
      interviewers: '홍길동, 홍길순',
      status: '예정',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
  ];

  const filtered =
    activeTab === '전체' ? interviews : interviews.filter((i) => i.status === activeTab);

  return (
    <div className="min-h-screen bg-[#fbf9f9] px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">면접 관리</h1>
        <button className="text-sm text-gray-500">공고별 보기 ▾</button>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-6 mb-8 border-b border-gray-300 pb-3">
        {(['전체', '예정', '완료', '진행중'] as InterviewStatus[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
              activeTab === tab
                ? 'bg-[#E35B43] text-white shadow'
                : 'text-gray-600 hover:text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 카드 리스트 */}
      <div className="grid grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="relative bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
          >
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">×</button>

            <div className="flex items-center gap-3 mb-3">
              <img
                src={item.avatar}
                alt={item.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.position}</p>
              </div>
              <span
                className={`ml-auto text-xs px-3 py-1 rounded-full ${
                  item.status === '진행중'
                    ? 'bg-purple-600 text-white'
                    : item.status === '완료'
                      ? 'bg-green-600 text-white'
                      : item.status === '예정'
                        ? 'bg-yellow-400 text-gray-800'
                        : 'bg-gray-300 text-gray-700'
                }`}
              >
                {item.status === '진행중' ? '면접 시작' : item.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-4">
              <p>
                <span className="font-medium text-gray-500">일자</span> {item.date}
              </p>
              <p>
                <span className="font-medium text-gray-500">시간</span> {item.time}
              </p>
              <p>
                <span className="font-medium text-gray-500">면접관</span> {item.interviewers}
              </p>
            </div>

            {/* 버튼 영역 */}
            <div className="flex gap-3">
              {item.status === '진행중' ? (
                <>
                  <button className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200">
                    질문 세트 보기
                  </button>
                  <button className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200">
                    이력서 열람
                  </button>
                </>
              ) : item.status === '예정' ? (
                <>
                  <button className="bg-[#E35B43] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#d44f3a]">
                    질문 세트 생성
                  </button>
                  <button className="bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg hover:bg-gray-200">
                    이력서 열람
                  </button>
                </>
              ) : (
                <>
                  <button className="bg-purple-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-purple-700">
                    면접 노트
                  </button>
                  <button className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700">
                    등록 완료
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
