import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

import sparkleImg from '../../../assets/Sparkles.png';
import peopleImg from '../../../assets/People.png';
import arrowImg from '../../../assets/Expand Arrow-2.png';

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
};

export default function MatchFilterSection({
  onSearch,
  onTabChange,
  onLimitChange,
  onJobChange,
  onSortChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('recommended');
  const [selectedLimit, setSelectedLimit] = useState<number>(10);
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const [sortType, setSortType] = useState<string>('latest');
  const [jdOptions, setJdOptions] = useState<JdOption[]>([]);

  // JD 목록 불러오기
  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem('accessToken'); // ⭐ JWT 가져오기

        const response = await fetch(`${baseUrl}/api/v1/jd/options`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`, // ⭐ JWT 추가
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('JD 목록 오류:', error);
          return;
        }

        const json = await response.json();
        console.log('JD 목록:', json);
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
        <div className="flex w-full flex-col gap-6">
          {/* 상단 필드 */}
          <div className="grid grid-cols-2 gap-6">
            {/* JD 선택 */}
            <div className="flex flex-col">
              <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">채용 공고</h2>
              <select
                value={selectedJob ?? ''}
                onChange={handleJobChange}
                className="rounded-md border border-[#E3DBDB] p-2 text-[15px] text-[#413F3F]"
              >
                <option value="">조회할 공고 선택</option>
                {jdOptions.map((jd) => (
                  <option key={jd.jdId} value={jd.jdId}>
                    {jd.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 추천 인원 */}
            {activeTab === 'recommended' ? (
              <div className="relative flex flex-col">
                <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">추천 인원</h2>
                <select
                  value={selectedLimit}
                  onChange={handleLimitChange}
                  className="w-full appearance-none rounded-md border border-[#E3DBDB] bg-white p-2 pr-10 text-[15px] text-[#413F3F]"
                >
                  <option value={3}>3명</option>
                  <option value={5}>5명</option>
                  <option value={10}>10명</option>
                  <option value={20}>20명</option>
                  <option value={30}>30명</option>
                </select>

                <img
                  src={arrowImg}
                  alt="arrow"
                  className="pointer-events-none absolute top-9 right-2 h-4 w-4"
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {/* 정렬 */}
          <div className="flex w-1/2 flex-col">
            <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">정렬순</h2>
            <select
              value={sortType}
              onChange={handleSortChange}
              className="rounded-md border border-[#E3DBDB] p-2 text-[15px] text-[#413F3F]"
            >
              <option value="latest">최신순</option>
              <option value="high">매칭 높은순</option>
              <option value="low">매칭 낮은순</option>
            </select>
          </div>
        </div>

        {/* 검색 버튼 */}
        <div className="ml-auto flex items-end pb-6">
          <button
            onClick={() => onSearch('')}
            className="flex items-center justify-center rounded-full bg-[#E3DBDB] p-3 hover:bg-[#D5CFCF]"
          >
            <Search size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
