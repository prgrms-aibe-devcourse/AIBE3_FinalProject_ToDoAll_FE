import { useState } from 'react';
import { Search } from 'lucide-react';
import sparkleImg from '../../../assets/Sparkles.png';
import peopleImg from '../../../assets/People.png';
import arrowImg from '../../../assets/Expand Arrow-2.png';
type Props = {
  onSearch: (_keyword: string) => void;
  onSortChange: (_sortBy: 'latest' | 'oldest' | 'name') => void;
  onTabChange: (_tab: 'all' | 'recommended') => void;
};

export default function MatchFilterSection({ onSearch, onTabChange }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');
  const [keyword] = useState('');

  const handleTabClick = (tab: 'all' | 'recommended') => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  const handleSearchClick = () => {
    onSearch(keyword);
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
          <img src={peopleImg} alt="people" className="h-4 w-4" />
          전체 조회
        </button>

        <button
          onClick={() => handleTabClick('recommended')}
          className={`text-l flex items-center gap-2 rounded-t-lg px-6 py-2 font-medium transition ${
            activeTab === 'recommended' ? 'bg-white text-[#837C7C]' : 'bg-[#E3DBDB] text-[#837C7C]'
          }`}
        >
          <img src={sparkleImg} alt="sparkle" className="h-5 w-5" />
          추천 후보
        </button>
      </div>
      {/* 필터 박스 */}{' '}
      <div className="flex rounded-b-lg bg-white p-8 shadow-md">
        {' '}
        {/* 왼쪽 영역 (필터) */}{' '}
        <div className="mr-auto flex w-full max-w-[480px] flex-col gap-6">
          {' '}
          {/* 첫 줄: 채용 공고 + 추천 인원 */} {/* 채용 공고 */}{' '}
          <div className="relative flex flex-1 flex-col">
            {' '}
            <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">채용 공고</h2>{' '}
            <select
              className="w-full appearance-none rounded-md border border-[#E3DBDB] bg-white p-2 pr-10 text-[15px] font-medium text-[#413F3F] shadow-none focus:outline-none"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                backgroundImage: 'none',
              }}
            >
              {' '}
              <option value="latest">시니어 프론트 개발자</option>{' '}
              <option value="oldest">백엔드 개발자</option>{' '}
              <option value="name">디자이너</option>{' '}
            </select>{' '}
            <img
              src={arrowImg}
              alt="arrow"
              className="pointer-events-none absolute top-[70%] right-2 h-4 w-4 -translate-y-1/2"
            />{' '}
          </div>{' '}
          {/* 추천 인원 */}{' '}
          {activeTab === 'recommended' && (
            <div className="relative flex flex-1 flex-col">
              {' '}
              <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">추천 인원</h2>{' '}
              <select
                className="w-full appearance-none rounded-md border border-[#E3DBDB] bg-white p-2 pr-10 text-[15px] font-medium text-[#413F3F] shadow-none focus:outline-none"
                style={{
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  backgroundImage: 'none',
                }}
              >
                {' '}
                <option value="1">1명</option> <option value="2">2명</option>{' '}
                <option value="3">3명</option>{' '}
              </select>{' '}
              <img
                src={arrowImg}
                alt="arrow"
                className="pointer-events-none absolute top-[70%] right-2 h-4 w-4 -translate-y-1/2"
              />{' '}
            </div>
          )}{' '}
          {/* 정렬순 */}{' '}
          <div className="relative flex w-full flex-col">
            {' '}
            <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">정렬순</h2>{' '}
            <select
              className="w-full appearance-none rounded-md border border-[#E3DBDB] bg-white p-2 pr-10 text-[15px] font-medium text-[#413F3F] shadow-none focus:outline-none"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                backgroundImage: 'none',
              }}
            >
              {' '}
              <option value="latest">최신순</option> <option value="oldest">오래된순</option>{' '}
              <option value="name">이름순</option>{' '}
            </select>{' '}
            <img
              src={arrowImg}
              alt="arrow"
              className="pointer-events-none absolute top-[70%] right-2 h-4 w-4 -translate-y-1/2"
            />{' '}
          </div>{' '}
        </div>
        {/* 오른쪽 검색 버튼 */}
        <div className="relative top-6 mt-auto ml-auto flex flex-col justify-end pb-6">
          <button
            onClick={handleSearchClick}
            className="flex items-center justify-center rounded-full bg-[#E3DBDB] p-3 shadow-none transition hover:bg-[#D5CFCF]"
          >
            <Search size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
