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

export default function TimeSlot({ time, type = 'INTERVIEW' }: TimeSlotProps) {
  return (
    <div className={cn(TimeSlotVariants({ type }))}>
      <p className="text-xl font-semibold">{time}</p>
      <p className="break-keep">{SLOT_STATUS[type]}</p>
    </div>
  );
}
