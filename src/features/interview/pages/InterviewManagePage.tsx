import { useState } from 'react';
import InterviewCard from '../components/manage/InterviewCard';
import InterviewFilterTabs from '../components/manage/InterviewFilterTabs';
import InterviewSortDropdown from '../components/manage/InterviewSortDropdown';
import type { TabStatus, InterviewStatus, ResultStatus } from '../types/interviewer';
import useFetch from '@shared/hooks/useFetch';
import { userDefaultImage } from '@/const.ts';
import PageTitle from '@shared/components/PageTitile.tsx';
import BlankCard from '@shared/components/BlankCard.tsx';

interface InterviewSummaryResponse {
  interviewId: number;
  jdId: number;
  jdTitle: string;
  resumeId: number;
  candidateName: string;
  status: InterviewStatus;
  resultStatus: ResultStatus;
  candidateAvatar: string;
  interviewers: string[];
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
  jdId: number;
  name: string;
  position: string;
  date: string;
  time: string;
  interviewers: string;
  status: InterviewStatus;
  result: ResultStatus;
  avatar: string;
  resumeId: number;
}

interface JobDescriptionInterviewOptionDto {
  jdId: number;
  title: string;
}

export default function InterviewManagePage() {
  const [activeTab, setActiveTab] = useState<TabStatus>('ALL');
  const [selectedJD, setSelectedJD] = useState<number | null>(null);
  const [cursor, setCursor] = useState<number | null>(null);

  // 뒤로가기 위한 cursor 스택
  const [cursorHistory, setCursorHistory] = useState<(number | null)[]>([null]);

  //const statusParam = activeTab === 'ALL' ? 'ALL' : tabToInterviewStatus[activeTab][0];
  const statusParam = activeTab;

  const params = new URLSearchParams({
    status: statusParam,
    limit: '6',
    sort: 'createdAt,desc',
  });

  if (selectedJD) params.append('jdId', selectedJD.toString());
  if (cursor) params.append('cursor', cursor.toString());

  const query = `/api/v1/interviews?${params.toString()}`;
  const { resData: interviewList } = useFetch<InterviewListResponse>(query);
  const { resData: jdList } = useFetch<JobDescriptionInterviewOptionDto[]>(
    '/api/v1/jd/interview/options'
  );

  const jobPosts =
    jdList?.map((jd) => ({
      id: jd.jdId,
      title: jd.title,
    })) ?? [];

  // const toKST = (dateStr: string) => {
  //   const date = new Date(dateStr);
  //   date.setHours(date.getHours() + 9);
  //   return date;
  // };

  const interviews: InterviewCardData[] =
    interviewList?.data?.map((i) => {
      const kstDate = new Date(i.scheduledAt);
      const pad = (n: number) => n.toString().padStart(2, '0');

      const year = kstDate.getFullYear();
      const month = pad(kstDate.getMonth() + 1);
      const day = pad(kstDate.getDate());
      const hours = pad(kstDate.getHours());
      const minutes = pad(kstDate.getMinutes());
      return {
        id: i.interviewId,
        jdId: i.jdId,
        name: i.candidateName,
        position: i.jdTitle,
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}`,
        interviewers: i.interviewers?.join(', ') || '면접관 없음',
        status: i.status,
        result: i.resultStatus,
        avatar: i.candidateAvatar || userDefaultImage,
        resumeId: i.resumeId,
      };
    }) ?? [];

  const handleNext = () => {
    if (interviewList?.nextCursor) {
      setCursorHistory((prev) => [...prev, interviewList.nextCursor]);
      setCursor(interviewList.nextCursor);
    }
  };

  const handlePrev = () => {
    if (cursorHistory.length > 1) {
      const newHistory = [...cursorHistory];
      newHistory.pop(); // 현재 커서 제거
      const prevCursor = newHistory[newHistory.length - 1];
      setCursorHistory(newHistory);
      setCursor(prevCursor);
    }
  };

  // 탭/공고 바뀌면 초기화
  const resetPage = () => {
    setCursor(null);
    setCursorHistory([null]);
  };
  const handleTabChange = (tab: TabStatus) => {
    setActiveTab(tab);
    resetPage();
  };
  const handleJDChange = (id: number | null) => {
    setSelectedJD(id);
    resetPage();
  };

  if (!interviewList) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-500">
        불러오는 중...
      </div>
    );
  }

  return (
    <PageTitle title="면접 관리" description="예정된 면접을 관리하세요.">
      <section className="xs:flex-row xs:justify-between flex flex-col gap-2">
        <InterviewFilterTabs activeTab={activeTab} onChange={handleTabChange} />
        <InterviewSortDropdown jobPosts={jobPosts} onSelect={handleJDChange} />
      </section>
      {interviews.length <= 0 ? (
        <BlankCard text={'해당하는 면접 일정이 없습니다.'} />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {interviews.map((item) => (
            <InterviewCard key={item.id} {...item} />
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center gap-6">
        {cursorHistory.length > 1 && (
          <button
            onClick={handlePrev}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            ◀ 이전 페이지
          </button>
        )}

        {interviewList.hasNext && (
          <button
            onClick={handleNext}
            className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
          >
            다음 페이지 ▶
          </button>
        )}
      </div>
    </PageTitle>
  );
}
