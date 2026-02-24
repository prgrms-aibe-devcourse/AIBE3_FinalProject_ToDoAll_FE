import type { TabStatus } from '../../types/interviewer';
import cn from '@lib/utils/cn.ts';

interface InterviewFilterTabsProps {
  activeTab: TabStatus;
  /* eslint-disable-next-line no-unused-vars */
  onChange: (status: TabStatus) => void;
}

export default function InterviewFilterTabs({ activeTab, onChange }: InterviewFilterTabsProps) {
  const tabs: TabStatus[] = ['ALL', 'WAITING', 'IN_PROGRESS', 'DONE'];

  const tabLabels: Record<TabStatus, string> = {
    ALL: '전체',
    WAITING: '예정',
    IN_PROGRESS: '진행중',
    DONE: '완료',
  };

  return (
    <div className="border-jd-scarlet inline-flex w-fit self-center rounded-full border-2 bg-white p-1 shadow-sm">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={cn(
              `rounded-full px-6 py-2 text-sm font-semibold whitespace-nowrap transition-all duration-200`,
              isActive ? 'bg-jd-scarlet text-white shadow-sm' : 'text-gray-600 hover:bg-[#fdeae7]'
            )}
          >
            {tabLabels[tab]}
          </button>
        );
      })}
    </div>
  );
}
