import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

import AllFilterSection from './AllFilterSection';
import RecommendedFilterSection from './RecommendedFilterSection';

import sparkleImg from '../../../assets/Sparkles.png';
import peopleImg from '../../../assets/People.png';

let baseUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

type JdOption = {
  jdId: number;
  title: string;
};

type Props = {
  onSearch: (_keyword: string) => void;
  onTabChange: (_tab: 'all' | 'recommended') => void;
  onLimitChange: (_limit: number) => void;
  onJobChange: (_jobId: number | null) => void;
  onSortChange: (_sortType: string) => void;
  onStatusChange?: (_status: string) => void;
};

export default function MatchFilterSection({
  onSearch,
  onTabChange,
  onLimitChange,
  onJobChange,
  onSortChange,
  onStatusChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('recommended');
  const [selectedLimit, setSelectedLimit] = useState<number>(10);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [sortType, setSortType] = useState<string>('LATEST');
  const [jdOptions, setJdOptions] = useState<JdOption[]>([]);
  const [status, setStatus] = useState<string>('');

  // JD 목록 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        const response = await fetch(`${baseUrl}/api/v1/jd/options`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('JD 목록 오류:', error);
          return;
        }

        const json = await response.json();
        setJdOptions(json.data ?? []);
      } catch (err) {
        console.error('JD 목록 불러오기 실패:', err);
      }
    };

    load();
  }, []);

  const handleTabClick = (tab: 'all' | 'recommended') => {
    setActiveTab(tab);
    onTabChange(tab);
    if (tab !== 'recommended') {
      setSelectedLimit(10);
      onLimitChange(10);
    }
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = Number(e.target.value);
    setSelectedLimit(val);
    onLimitChange(val);
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const val = value === '' ? null : Number(value);
    setSelectedJob(val);
    onJobChange(val);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSortType(val);
    onSortChange(val);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setStatus(val);
    onStatusChange?.(val); // 상위 컴포넌트로도 전달
  };

  return (
    <div className="flex flex-col gap-0 rounded-lg p-4">
      {/* 상단 탭 */}
      <div className="flex">
        <button
          onClick={() => handleTabClick('all')}
          className={`text-l flex items-center gap-2 rounded-t-lg px-6 py-2 font-medium transition ${
            activeTab === 'all' ? 'bg-white text-[#837C7C]' : 'bg-[#E3DBDB] text-[#837C7C]'
          }`}
        >
          <img src={peopleImg} className="h-4 w-4" />
          전체 조회
        </button>

        <button
          onClick={() => handleTabClick('recommended')}
          className={`text-l flex items-center gap-2 rounded-t-lg px-6 py-2 font-medium transition ${
            activeTab === 'recommended' ? 'bg-white text-[#837C7C]' : 'bg-[#E3DBDB] text-[#837C7C]'
          }`}
        >
          <img src={sparkleImg} className="h-5 w-5" />
          추천 후보
        </button>
      </div>

      {/* 필터 영역 */}
      <div className="flex w-full rounded-b-lg bg-white p-8 shadow-md">
        {activeTab === 'all' ? (
          <AllFilterSection
            selectedJob={selectedJob}
            onJobChange={handleJobChange}
            sortType={sortType}
            onSortChange={handleSortChange}
            jdOptions={jdOptions}
            status={status}
            onStatusChange={handleStatusChange}
          />
        ) : (
          <RecommendedFilterSection
            selectedJob={selectedJob}
            onJobChange={handleJobChange}
            sortType={sortType}
            onSortChange={handleSortChange}
            selectedLimit={selectedLimit}
            onLimitChange={handleLimitChange}
            jdOptions={jdOptions}
          />
        )}
        {/*  새로고침 버튼 */}
        <div className="ml-auto flex items-end pb-6">
          <button
            onClick={() => onSearch('')}
            className="flex items-center justify-center rounded-full bg-[#E3DBDB] p-3 hover:bg-[#D5CFCF]"
          >
            <RotateCw size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
