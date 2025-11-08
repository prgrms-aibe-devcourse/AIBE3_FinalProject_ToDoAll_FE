import { useState } from 'react';
import InterviewCard from '../components/manage/InterviewCard';
import InterviewFilterTabs from '../components/manage/InterviewFilterTabs';
import type { TabStatus, InterviewStatus } from '../types/interviewer';
import { tabToInterviewStatus } from '../types/interviewer';

interface InterviewCardData {
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
  const [activeTab, setActiveTab] = useState<TabStatus>('전체');

  const interviews: InterviewCardData[] = [
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
      status: '합격',
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
    {
      id: 4,
      name: '김철수2',
      position: '시니어 프론트엔드 개발자 구합니다',
      date: '2025-12-01',
      time: '12:00',
      interviewers: '홍길동, 홍길순',
      status: '미정',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
  ];

  const filtered =
    activeTab === '전체'
      ? interviews
      : interviews.filter((i) => tabToInterviewStatus[activeTab].includes(i.status));

  return (
    <div className="min-h-screen bg-[#fbf9f9] px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">면접 관리</h1>
        <button className="text-sm text-gray-500 relative top-10">공고별 보기 ▾</button>
      </div>

      {/* 필터 탭 */}
      <InterviewFilterTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* 카드 리스트 */}
      <div className="grid grid-cols-3 gap-8 mt-6">
        {filtered.map((item) => (
          <InterviewCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
