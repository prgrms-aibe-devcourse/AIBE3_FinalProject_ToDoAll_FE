import { cva, type VariantProps } from 'class-variance-authority';
import cn from '@lib/utils/cn.ts';

export type TimeSlotType = 'INTERVIEW' | 'JOB_CLOSE';

const SLOT_STATUS = {
  INTERVIEW: '면접',
  JOB_CLOSE: '공고 마감',
} as const satisfies Record<TimeSlotType, string>;

const TimeSlotVariants = cva(
  'flex flex-col items-center justify-center rounded-[10px] p-[10px] text-center',
  {
    variants: {
      type: {
        INTERVIEW: 'bg-[#F8DCD7]',
        JOB_CLOSE: 'bg-[#E1D5E1]',
      },
    },
  }
);

interface TimeSlotProps extends VariantProps<typeof TimeSlotVariants> {
  id: number;
  time: string;
  title: string;
  type: TimeSlotType;
}

export default function TimeSlot({ time, title, type = 'INTERVIEW' }: TimeSlotProps) {
  return (
    <>
      <div className={cn(TimeSlotVariants({ type }), 'group relative')}>
        {type == 'INTERVIEW' ? (
          <p className="text-xl font-semibold">{time}</p>
        ) : (
          <p className="w-full truncate text-xl font-semibold">{title}</p>
        )}
        <p className="break-keep">{SLOT_STATUS[type]}</p>

        <div
          className={cn(
            'pointer-events-none z-20',
            'absolute bottom-full left-1/2',
            'mb-2 -translate-x-1/2',
            'bg-jd-gray-light border-jd-gray-dark rounded-lg border px-3 py-2',
            'text-xs shadow-md',
            'translate-y-1 opacity-0',
            'transition-all duration-150',
            'group-hover:translate-y-0 group-hover:opacity-100'
          )}
        >
          {type == 'INTERVIEW' ? (
            <p className="w-max">[{title}] 님 면접</p>
          ) : (
            <p>
              <span className="inline-block w-max">[{title}]</span>
              접수 마감
            </p>
          )}
        </div>
      </div>
    </>
  );
}
