import { useState, useEffect } from 'react';
import InterviewCard from '../components/manage/InterviewCard';
import InterviewFilterTabs from '../components/manage/InterviewFilterTabs';
import InterviewSortDropdown from '../components/manage/InterviewSortDropdown';
import type { TabStatus, InterviewStatus } from '../types/interviewer';
import { tabToInterviewStatus } from '../types/interviewer';

interface InterviewSummaryResponse {
  interviewId: number;
  jdId: number;
  jdTitle: string;
  candidateName: string;
  status: InterviewStatus;
  scheduledAt: string;
  createdAt: string;
}

interface InterviewListResponse {
  data: InterviewSummaryResponse[];
  nextCursor: number | null;
  hasNext: boolean;
}

interface InterviewCardData {
  id: number;
  jd_id: number;
  name: string;
  position: string;
  date: string;
  time: string;
  interviewers: string;
  status: InterviewStatus;
  avatar: string;
}

export default function InterviewManagePage() {
  const [activeTab, setActiveTab] = useState<TabStatus>('ALL');
  const [selectedJD, setSelectedJD] = useState<number | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);
  const [interviews, setInterviews] = useState<InterviewCardData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    setLoading(true);

    try {
      const statusParam = activeTab === 'ALL' ? 'ALL' : tabToInterviewStatus[activeTab][0];

      const params = new URLSearchParams({
        status: statusParam,
        limit: '6',
        sort: 'createdAt,desc',
      });

      if (selectedJD) params.append('jdId', selectedJD.toString());
      if (cursor) params.append('cursor', cursor.toString());

      const query = `http://localhost:8080/api/v1/interviews?${params.toString()}`;
      console.log('%cFETCH URL:', 'color: #0af', query);

      const res = await fetch(query);
      if (!res.ok) throw new Error('인터뷰 조회 실패');

      const json = await res.json();
      const list: InterviewListResponse = json.data;

      const mapped = list.data.map((i) => ({
        id: i.interviewId,
        jd_id: i.jdId,
        name: i.candidateName,
        position: i.jdTitle,
        date: i.scheduledAt.split('T')[0],
        time: i.scheduledAt.split('T')[1].slice(0, 5),
        interviewers: '면접관 정보 필요',
        status: i.status,
        avatar: '/default-avatar.png',
      }));

      setInterviews(mapped);
      setCursor(list.nextCursor ?? null);
    } catch (err) {
      console.error(' 인터뷰 불러오기 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [activeTab, selectedJD]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="bg-jd-white min-h-screen px-12 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">면접 관리</h1>
        <InterviewSortDropdown jobPosts={[]} onSelect={setSelectedJD} />
      </div>

      <InterviewFilterTabs activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6 grid grid-cols-3 gap-8">
        {interviews.length > 0 ? (
          interviews.map((item) => <InterviewCard key={item.id} {...item} />)
        ) : (
          <div className="col-span-3 py-16 text-center text-gray-500">
            해당 조건에 맞는 면접이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
