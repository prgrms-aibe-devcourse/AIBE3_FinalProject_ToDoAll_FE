import { useState, useMemo } from 'react';
import type { Interviewer } from '../types/interviewer';
import ApplicantProfileCard from '../components/create/ApplicantProfileCard';
import InterviewerSearchBox from '../components/create/InterviewerSearchBox';
import InvitedList from '../components/create/InvitedList';

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
  ]);
  const [invited, setInvited] = useState<Interviewer[]>([]);

  const invitedIds = invited.map((p) => p.id);
  const filtered = useMemo(() => {
    return search.trim().length > 0
      ? interviewers.filter(
          (i) =>
            !invitedIds.includes(i.id) &&
            (i.name.includes(search) || i.email.toLowerCase().includes(search.toLowerCase()))
        )
      : [];
  }, [search, interviewers, invitedIds]);

  const handleInvite = (person: Interviewer) => {
    if (!invited.find((i) => i.id === person.id)) {
      setInvited((prev) => [...prev, person]);
      setSearch('');
    }
  };

  const handleRemove = (id: number) => {
    setInvited((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f9] px-12 py-8">
      <h1 className="mt-4 w-40 text-xl font-semibold">면접 생성</h1>

      <div className="mt-16 mr-40 flex flex-1 items-start justify-center rounded-3xl bg-white p-10 shadow-xl">
        <div className="flex w-full max-w-5xl gap-12">
          {/* 왼쪽 지원자 */}
          <div className="flex-1">
            <ApplicantProfileCard />
          </div>

          {/* 오른쪽 면접관 초대 */}
          <div className="relative flex flex-[1.2] flex-col">
            <h2 className="mb-4 text-lg font-semibold">면접관 초대</h2>
            <InterviewerSearchBox
              search={search}
              setSearch={setSearch}
              filtered={filtered}
              handleInvite={handleInvite}
            />
            <InvitedList invited={invited} handleRemove={handleRemove} />
            <button className="mt-6 self-end rounded-lg bg-[#E35B43] px-6 py-2.5 font-semibold text-white transition hover:bg-[#d44f3a]">
              면접 초대
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
