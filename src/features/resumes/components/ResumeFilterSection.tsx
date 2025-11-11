import { useState } from 'react';

type Props = {
  onSearch: (_keyword: string) => void;
  onSortChange: (_sortBy: 'latest' | 'oldest' | 'name') => void; // string → 유니온 타입
  onTabChange: (_tab: 'all' | 'recommended') => void;
};

export default function ResumeFilterSection({ onSearch, onSortChange, onTabChange }: Props) {
  const [activeTab, setActiveTab] = useState<'all' | 'recommended'>('all');

  const handleTabClick = (tab: 'all' | 'recommended') => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm">
      {/* 🔹 책갈피 모양 탭 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => handleTabClick('all')}
          className={`px-4 py-2 font-medium rounded-t-md ${
            activeTab === 'all'
              ? 'bg-[#5C1E78] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체 지원자
        </button>
        <button
          onClick={() => handleTabClick('recommended')}
          className={`px-4 py-2 font-medium rounded-t-md ${
            activeTab === 'recommended'
              ? 'bg-[#5C1E78] text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          추천 후보
        </button>
      </div>

      {/* 🔍 검색 및 정렬 */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
        <input
          type="text"
          placeholder="이름 또는 기술로 검색"
          className="border p-2 rounded-md w-full md:w-1/2"
          onChange={(e) => onSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded-md w-full md:w-auto"
          onChange={(e) => onSortChange(e.target.value as 'latest' | 'oldest' | 'name')}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
          <option value="name">이름순</option>
        </select>
      </div>
    </div>
  );
}
