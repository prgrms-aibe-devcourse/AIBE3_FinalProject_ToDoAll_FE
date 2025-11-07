import { useState } from 'react';
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
  const filtered =
    search.trim().length > 0
      ? interviewers.filter(
          (i) =>
            !invitedIds.includes(i.id) &&
            (i.name.includes(search) || i.email.toLowerCase().includes(search.toLowerCase()))
        )
      : [];

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
      <h1 className="text-xl font-semibold w-40 mt-4">면접 생성</h1>

      <div className="flex flex-1 justify-center items-start bg-white rounded-3xl shadow-xl p-10 mt-16 mr-40">
        <div className="flex gap-12 w-full max-w-5xl">
          {/* 왼쪽 지원자 */}
          <div className="flex-1">
            <ApplicantProfileCard />
          </div>

          {/* 오른쪽 면접관 초대 */}
          <div className="flex-[1.2] flex flex-col relative">
            <h2 className="font-semibold text-lg mb-4">면접관 초대</h2>
            <InterviewerSearchBox
              search={search}
              setSearch={setSearch}
              filtered={filtered}
              handleInvite={handleInvite}
            />
            <InvitedList invited={invited} handleRemove={handleRemove} />
            <button className="mt-6 self-end bg-[#E35B43] text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-[#d44f3a] transition">
              면접 초대
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
