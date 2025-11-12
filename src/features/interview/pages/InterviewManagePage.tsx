import { useState } from 'react';
import InterviewCard from '../components/manage/InterviewCard';
import InterviewFilterTabs from '../components/manage/InterviewFilterTabs';
import InterviewSortDropdown from '../components/manage/InterviewSortDropdown';
import type { TabStatus, InterviewStatus } from '../types/interviewer';
import { tabToInterviewStatus } from '../types/interviewer';

interface InterviewCardData {
  id: number; // 인터뷰 고유 ID
  jd_id: number; // 해당 인터뷰가 속한 공고(Job Description)의 ID
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
  const [selectedJD, setSelectedJD] = useState<number | null>(null);

  // 예시 공고 리스트
  const jobPosts = [
    { id: 1, title: '시니어 프론트엔드 개발자' },
    { id: 2, title: '백엔드 개발자 (Spring)' },
  ];

  // 예시 인터뷰 데이터
  const interviews: InterviewCardData[] = [
    {
      id: 1,
      jd_id: 1,
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
      jd_id: 1,
      name: '이영희',
      position: '시니어 프론트엔드 개발자 구합니다',
      date: '2025-12-02',
      time: '15:00',
      interviewers: '홍길동, 홍길순',
      status: '합격',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 3,
      jd_id: 2,
      name: '박민수',
      position: '백엔드 개발자 (Spring)',
      date: '2025-12-05',
      time: '14:00',
      interviewers: '홍길동, 김영희',
      status: '예정',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
    {
      id: 4,
      jd_id: 2,
      name: '정현우',
      position: '백엔드 개발자 (Spring)',
      date: '2025-12-06',
      time: '10:00',
      interviewers: '홍길동, 이지현',
      status: '미정',
      avatar: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
    },
  ];

  // 탭 + 공고 기준 필터링
  const filtered = interviews.filter((i) => {
    const matchTab = activeTab === '전체' || tabToInterviewStatus[activeTab].includes(i.status);
    const matchJD = selectedJD ? i.jd_id === selectedJD : true;
    return matchTab && matchJD;
  });

  return (
    <div className="min-h-screen bg-jd-white px-12 py-8">
      {/* 상단 영역 */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">면접 관리</h1>
        <InterviewSortDropdown jobPosts={jobPosts} onSelect={setSelectedJD} />
      </div>

      {/* 필터 탭 */}
      <InterviewFilterTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* 카드 리스트 */}
      <div className="grid grid-cols-3 gap-8 mt-6">
        {filtered.map((item) => (
          <InterviewCard key={item.id} {...item} />
        ))}

        {filtered.length === 0 && (
          <div className="col-span-3 text-center text-gray-500 py-16">
            해당 조건에 맞는 면접이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
