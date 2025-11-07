import { useState } from 'react';
import { Search } from 'lucide-react';
import type { Interviewer } from '../types/interviewer';

export default function InterviewCreatePage() {
  const [search, setSearch] = useState('');
  const [interviewers] = useState<Interviewer[]>([
    {
      id: 1,
      name: '박철수',
      email: 'abcd@gmail.com',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 2,
      name: '이영희',
      email: 'lee@gmail.com',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 3,
      name: '김민수',
      email: 'kim@gmail.com',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 4,
      name: '김민수1',
      email: 'kim@gmail.com',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 5,
      name: '김민수2',
      email: 'kim@gmail.com',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
  ]);

  // 초대한 면접관 목록
  const [invited, setInvited] = useState<Interviewer[]>([]);

  // 이미 초대한 id 목록
  const invitedIds = invited.map((p) => p.id);

  // 검색 결과 필터:
  // 1) 이름이나 이메일에 검색어 포함
  // 2) 이미 초대한 사람은 제외
  const filtered =
    search.trim().length > 0
      ? interviewers.filter(
          (i) =>
            !invitedIds.includes(i.id) && // 초대한 사람 빼기
            (i.name.includes(search) || i.email.toLowerCase().includes(search.toLowerCase()))
        )
      : [];

  const handleInvite = (person: Interviewer) => {
    if (!invited.find((i) => i.id === person.id)) {
      setInvited((prev) => [...prev, person]);
      setSearch(''); //검색창 초기화
    }
  };

  const handleRemove = (id: number) => {
    setInvited((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f9] px-12 py-8">
      <h1 className="text-xl font-semibold w-40 mt-4">면접 생성</h1>

      <div className="flex flex-1 justify-center items-start bg-white rounded-3xl shadow-xl p-10 mt-16 mr-40">
        <div className="flex gap-12 w-full max-w-5xl">
          {/* 왼쪽 지원자 프로필 카드 */}
          <div className="flex-1">
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
          </div>

          {/* 오른쪽 면접관 초대 영역 */}
          <div className="flex-[1.2] flex flex-col relative">
            <h2 className="font-semibold text-lg mb-4">면접관 초대</h2>

            {/* 검색창 */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="닉네임 또는 이메일을 입력하세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            {/* 검색 결과: 리스트 위에 덮어지는 레이어 */}
            {search && (
              <div className="absolute top-24 left-0 w-full z-20">
                <div className="bg-white border-gray-300 rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto space-y-3">
                  {filtered.length > 0 ? (
                    filtered.map((i) => (
                      <div
                        key={i.id}
                        className="flex items-center justify-between border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={i.avatar}
                            alt={i.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{i.name}</p>
                            <p className="text-xs text-gray-500">{i.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleInvite(i)}
                          className="px-4 py-1.5 text-sm rounded-md font-semibold bg-[#E35B43] text-white hover:bg-[#d44f3a]"
                        >
                          선택
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-gray-400 py-4">
                      검색 결과가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 초대한 면접관 목록 */}
            <div className="flex-1 overflow-y-auto pr-1 mt-2">
              {invited.length > 0 ? (
                <div className="space-y-3">
                  {invited.map((i) => (
                    <div
                      key={i.id}
                      className="relative flex items-center border-gray-500 rounded-xl shadow px-4 py-3 bg-white"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={i.avatar}
                          alt={i.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-gray-800 font-medium">{i.name}</span>
                      </div>

                      {/* ✅ 오른쪽 상단 X 버튼 */}
                      <button
                        onClick={() => handleRemove(i.id)}
                        className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center 
               bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 text-xs 
               transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-6">초대한 면접관이 없습니다.</p>
              )}
            </div>

            <button className="mt-6 self-end bg-[#E35B43] text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-[#d44f3a] transition">
              면접 초대
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
