import type { TabStatus } from '../../types/interviewer';

interface InterviewFilterTabsProps {
  activeTab: TabStatus;
  /* eslint-disable-next-line no-unused-vars */
  onChange: (status: TabStatus) => void;
}

export default function InterviewFilterTabs({ activeTab, onChange }: InterviewFilterTabsProps) {
  const tabs: TabStatus[] = ['전체', '예정', '완료', '진행중'];

  return (
    <div className="border-jd-scarlet inline-flex rounded-full border-2 bg-white p-1 shadow-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`rounded-full px-6 py-2 text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-jd-scarlet text-white shadow-sm' : 'text-gray-600 hover:bg-[#fdeae7]'} `}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
}
