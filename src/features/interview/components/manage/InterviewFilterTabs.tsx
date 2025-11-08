import type { TabStatus } from '../../types/interviewer';

interface InterviewFilterTabsProps {
  activeTab: TabStatus;
  /* eslint-disable-next-line no-unused-vars */
  onChange: (status: TabStatus) => void;
}

/**
 * 면접 관리 페이지의 상단 필터 탭
 * - 전체 / 예정 / 완료 / 진행중
 */
export default function InterviewFilterTabs({ activeTab, onChange }: InterviewFilterTabsProps) {
  const tabs: TabStatus[] = ['전체', '예정', '완료', '진행중'];

  return (
    <div className="inline-flex border-2 border-[#E35B43] rounded-full p-1 bg-white shadow-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-all duration-200
              ${isActive ? 'bg-[#E35B43] text-white shadow-sm' : 'text-gray-600 hover:bg-[#fdeae7]'}
            `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
