import { Search } from 'lucide-react';
import { useState } from 'react';
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
  const [open, setOpen] = useState(false);

  return (
    <div className="relative mb-6">
      {/* 검색창 */}
      <input
        type="text"
        placeholder="닉네임 또는 이메일을 입력하세요"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-full border border-gray-300 py-2.5 pr-10 pl-4 focus:ring-2 focus:ring-gray-400 focus:outline-none"
      />
      <Search size={18} className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400" />

      {/* 검색 결과 */}
      {open && (
        <div className="absolute top-14 left-0 z-20 w-full">
          <div className="max-h-60 space-y-3 overflow-y-auto rounded-xl border border-gray-300 bg-white p-4 shadow-lg">
            {filtered.length > 0 ? (
              filtered.map((i) => (
                <div
                  key={i.id}
                  className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 hover:bg-gray-50"
                  onClick={() => handleInvite(i)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={i.avatar ?? '/images/default-profile.jpg'}
                      alt={i.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{i.name}</p>
                      <p className="text-xs text-gray-500">{i.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-sm text-gray-400">
                초대 가능한 면접관이 없습니다.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
