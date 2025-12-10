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
        className="w-full rounded-full border border-gray-300 py-2.5 pr-10 pl-4 focus:ring-2 focus:ring-gray-400 focus:outline-none"
      />
      <Search size={18} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />

      {/* 검색 결과 */}
      {search && (
        <div className="absolute top-14 left-0 z-20 w-full">
          <div className="max-h-60 space-y-3 overflow-y-auto rounded-xl border border-gray-300 bg-white p-4 shadow-lg">
            {filtered.length > 0 ? (
              filtered.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between rounded-lg border-gray-300 px-4 py-2 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={i.avatar}
                      alt={i.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-gray-500">{i.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleInvite(i)}
                    className="rounded-md bg-[#E35B43] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#d44f3a]"
                  >
                    선택
                  </button>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-gray-400">검색 결과가 없습니다.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
