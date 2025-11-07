import { useState } from 'react';
import { Search } from 'lucide-react';

interface Invitee {
  id: number;
  name: string;
  avatar: string;
}

export default function InterviewCreatePage() {
  const [search, setSearch] = useState('');
  const [invitees, setInvitees] = useState<Invitee[]>([
    { id: 1, name: '박철수', avatar: '/avatar1.png' },
    { id: 2, name: '박철수', avatar: '/avatar1.png' },
    { id: 3, name: '박철수', avatar: '/avatar1.png' },
    { id: 4, name: '박철수', avatar: '/avatar1.png' },
  ]);

  const handleRemove = (id: number) => {
    setInvitees(invitees.filter((i) => i.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f9] px-12 py-8">
      <h1 className="text-xl font-semibold w-40 mt-4">면접 생성</h1>

      <div className="flex flex-1 justify-center items-start bg-white rounded-3xl shadow-sm p-10">
        <div className="flex gap-12 w-full max-w-5xl">
          {/* 왼쪽 프로필 카드 */}
          <div className="flex-1">
            <div className="bg-[#d8cfcc] rounded-xl p-6 flex flex-col items-center shadow-md">
              <img
                src="/profile-sample.jpg"
                alt="김잡다"
                className="w-36 h-36 rounded-full object-cover mb-6"
              />
              <div className="text-center">
                <h2 className="text-xl font-bold mb-2">김잡다</h2>
                <p className="text-sm text-gray-700 mb-6">잡다컴퍼니 백엔드 개발자 채용</p>

                <div className="text-left text-sm text-gray-700 space-y-2">
                  <p>
                    <span className="font-semibold w-20 inline-block">생년월일</span>
                    1997.04.03 (만 29세)
                  </p>
                  <p>
                    <span className="font-semibold w-20 inline-block">email</span>
                    jobda1@gmail.com
                  </p>
                  <p>
                    <span className="font-semibold w-20 inline-block">전화번호</span>
                    010-1234-5678
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 면접 초대 */}
          <div className="flex-[1.2] flex flex-col">
            <h2 className="font-semibold text-lg mb-4">면접 초대</h2>

            <div className="relative mb-6">
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
              <Search
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {invitees.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center bg-white border rounded-xl shadow-sm px-4 py-3 justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={i.avatar}
                      alt={i.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium">{i.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemove(i.id)}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ×
                  </button>
                </div>
              ))}
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
