import { Search } from 'lucide-react';
import type { Interviewer } from '../../types/interviewer';

interface Props {
  search: string;
  /* eslint-disable-next-line no-unused-vars */
  setSearch: (value: string) => void;
  filtered: Interviewer[];
  /* eslint-disable-next-line no-unused-vars */
  handleInvite: (person: Interviewer) => void;
}

export default function InterviewerSearchBox({ search, setSearch, filtered, handleInvite }: Props) {
  return (
    <div className="relative mb-6">
      {/* 검색창 */}
      <input
        type="text"
        placeholder="닉네임 또는 이메일을 입력하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded-full py-2.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
      <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />

      {/* 검색 결과 */}
      {search && (
        <div className="absolute top-14 left-0 w-full z-20">
          <div className="bg-white border border-gray-300 rounded-xl shadow-lg p-4 max-h-60 overflow-y-auto space-y-3">
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
              <div className="text-center text-sm text-gray-400 py-4">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
