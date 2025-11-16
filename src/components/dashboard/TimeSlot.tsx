import { cva, type VariantProps } from 'class-variance-authority';
import cn from '@lib/utils/cn.ts';

export type TimeSlotType = 'interview' | 'job_close';

const SLOT_STATUS = {
  interview: '면접',
  job_close: '공고 마감',
} as const satisfies Record<TimeSlotType, string>;

const TimeSlotVariants = cva(
  'flex flex-col items-center justify-center rounded-[10px] p-[10px] text-center',
  {
    variants: {
      type: {
        interview: 'bg-[#F8DCD7]',
        job_close: 'bg-[#E1D5E1]',
      },
    },
  }
);

interface TimeSlotProps extends VariantProps<typeof TimeSlotVariants> {
  time: string;
  count: number;
  type: TimeSlotType;
}

export default function TimeSlot({ time, count, type = 'interview' }: TimeSlotProps) {
  return (
    <div className={cn(TimeSlotVariants({ type }))}>
      <p className="text-xl font-semibold">{time}</p>
      <p>
        {SLOT_STATUS[type]} {count}건
      </p>
    </div>
  );
}
