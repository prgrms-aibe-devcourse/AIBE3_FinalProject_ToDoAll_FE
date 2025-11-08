import type { InterviewStatus } from './InterviewCard';

interface InterviewFilterTabsProps {
  activeTab: InterviewStatus;
  /* eslint-disable-next-line no-unused-vars */
  onChange: (status: InterviewStatus) => void;
}

export default function InterviewFilterTabs({ activeTab, onChange }: InterviewFilterTabsProps) {
  const tabs: InterviewStatus[] = ['전체', '예정', '완료', '진행중'];

  return (
    <div className="inline-flex border-2 border-[#E35B43] rounded-full p-1 bg-white">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
            activeTab === tab
              ? 'bg-[#E35B43] text-white shadow-sm'
              : 'text-gray-600 hover:bg-[#fdeae7]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
