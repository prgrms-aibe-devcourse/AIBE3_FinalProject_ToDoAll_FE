import { useState } from 'react';
import { Search } from 'lucide-react';

interface Interviewer {
  id: number;
  name: string;
  email: string;
  avatar: string;
}

export default function InterviewCreatePage() {
  const [search, setSearch] = useState('');
  const [interviewers] = useState<Interviewer[]>([
    { id: 1, name: '박철수', email: 'abcd@gmail.com', avatar: '/avatar1.png' },
    { id: 2, name: '이영희', email: 'lee@gmail.com', avatar: '/avatar2.png' },
    { id: 3, name: '김민수', email: 'kim@gmail.com', avatar: '/avatar3.png' },
    { id: 4, name: '김민수1', email: 'kim@gmail.com', avatar: '/avatar3.png' },
    { id: 5, name: '김민수2', email: 'kim@gmail.com', avatar: '/avatar3.png' },
  ]);
  const [invited, setInvited] = useState<Interviewer[]>([]);
  const [isSelected, setIsSelected] = useState(false); // ✅ 선택 완료 상태

  const filtered = search
    ? interviewers.filter(
        (i) => i.name.includes(search) || i.email.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleInvite = (person: Interviewer) => {
    if (!invited.find((i) => i.id === person.id)) {
      setInvited((prev) => [...prev, person]);
      setSearch('');
      setIsSelected(true); // ✅ 초대 완료 시 검색 비활성화
    }
  };

  const handleRemove = (id: number) => {
    setInvited((prev) => prev.filter((i) => i.id !== id));
    if (invited.length === 1) setIsSelected(false); // ✅ 모두 삭제되면 다시 검색 가능
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f9] px-12 py-8">
      <h1 className="text-xl font-semibold w-40 mt-4">면접 생성</h1>

      <div className="flex flex-1 justify-center items-start bg-white rounded-3xl shadow-sm p-10 relative">
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

          {/* 오른쪽 면접관 초대 */}
          <div className="flex-[1.2] flex flex-col relative">
            <h2 className="font-semibold text-lg mb-4">면접관 초대</h2>

            {/* 검색창 */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="닉네임 또는 이메일을 입력하세요"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={isSelected} // 선택 완료 시 비활성화
                className={`w-full border border-gray-300 rounded-full py-2.5 pl-4 pr-10 focus:outline-none ${
                  isSelected
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'focus:ring-2 focus:ring-gray-400'
                }`}
              />
              <Search
                size={18}
                className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                  isSelected ? 'text-gray-300' : 'text-gray-400'
                }`}
              />
            </div>

            {/* 검색 결과 */}
            {!isSelected && search && filtered.length > 0 && (
              <div className="absolute top-24 left-0 w-full bg-white border rounded-xl shadow-lg z-20 p-4 space-y-3">
                {filtered.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between border rounded-lg px-4 py-2 hover:bg-gray-50"
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
                ))}
              </div>
            )}

            {/* 초대한 면접관 목록 */}
            <div className="flex-1 overflow-y-auto pr-1">
              {invited.length > 0 ? (
                <div className="space-y-3">
                  {invited.map((i) => (
                    <div
                      key={i.id}
                      className="flex items-center justify-between border rounded-xl shadow-sm px-4 py-3 bg-white"
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
                        onClick={() => handleRemove(i.id)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
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
