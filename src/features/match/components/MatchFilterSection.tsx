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
    <div className="flex flex-col gap-0 p-4 rounded-lg">
      {/* 상단 탭 */}
      <div className="flex">
        <button
          onClick={() => handleTabClick('all')}
          className={`flex items-center gap-2 px-6 py-2 text-l font-medium rounded-t-lg transition ${
            activeTab === 'all' ? 'bg-white text-[#837C7C]' : 'bg-[#E3DBDB] text-[#837C7C]'
          }`}
        >
          <img src={peopleImg} alt="people" className="w-4 h-4" />
          전체 조회
        </button>

        <button
          onClick={() => handleTabClick('recommended')}
          className={`flex items-center gap-2 px-6 py-2 text-l font-medium rounded-t-lg transition ${
            activeTab === 'recommended' ? 'bg-white text-[#837C7C]' : 'bg-[#E3DBDB] text-[#837C7C]'
          }`}
        >
          <img src={sparkleImg} alt="sparkle" className="w-5 h-5" />
          추천 후보
        </button>
      </div>
      {/* 필터 박스 */}{' '}
      <div className="flex bg-white p-8 rounded-b-lg shadow-md">
        {' '}
        {/* 왼쪽 영역 (필터) */}{' '}
        <div className="flex flex-col gap-6 w-full max-w-[480px] mr-auto">
          {' '}
          {/* 첫 줄: 채용 공고 + 추천 인원 */} {/* 채용 공고 */}{' '}
          <div className="flex flex-col flex-1 relative">
            {' '}
            <h2 className="text-[#413F3F] text-[14px] font-medium mb-1">채용 공고</h2>{' '}
            <select
              className="appearance-none bg-white border border-[#E3DBDB] rounded-md p-2 pr-10 text-[15px] w-full shadow-none focus:outline-none font-medium text-[#413F3F]"
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
              className="w-4 h-4 absolute right-2 top-[70%] -translate-y-1/2 pointer-events-none"
            />{' '}
          </div>{' '}
          {/* 추천 인원 */}{' '}
          {activeTab === 'recommended' && (
            <div className="flex flex-col flex-1 relative">
              {' '}
              <h2 className="text-[#413F3F] text-[14px] font-medium mb-1">추천 인원</h2>{' '}
              <select
                className="appearance-none bg-white border border-[#E3DBDB] rounded-md p-2 pr-10 text-[15px] w-full shadow-none focus:outline-none font-medium text-[#413F3F]"
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
                className="w-4 h-4 absolute right-2 top-[70%] -translate-y-1/2 pointer-events-none"
              />{' '}
            </div>
          )}{' '}
          {/* 정렬순 */}{' '}
          <div className="flex flex-col w-full relative">
            {' '}
            <h2 className="text-[#413F3F] text-[14px] font-medium mb-1">정렬순</h2>{' '}
            <select
              className="appearance-none bg-white border border-[#E3DBDB] rounded-md p-2 pr-10 text-[15px] w-full shadow-none focus:outline-none font-medium text-[#413F3F]"
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
              className="w-4 h-4 absolute right-2 top-[70%] -translate-y-1/2 pointer-events-none"
            />{' '}
          </div>{' '}
        </div>
        {/* 오른쪽 검색 버튼 */}
        <div className="flex flex-col justify-end ml-auto mt-auto pb-6 relative top-6">
          <button
            onClick={handleSearchClick}
            className="flex items-center justify-center bg-[#E3DBDB] hover:bg-[#D5CFCF] rounded-full p-3 transition shadow-none"
          >
            <Search size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
