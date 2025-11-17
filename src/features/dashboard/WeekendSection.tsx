import TimeSlot, { type TimeSlotType } from '@components/dashboard/TimeSlot.tsx';

const CalendarData = {
  mon: [
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'job_close',
      count: 2,
    },
  ],
  tue: [
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
  ],
  wed: [
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
  ],
  thu: [
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
  ],
  fri: [
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'job_close',
      count: 2,
    },
  ],
  sat: [
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
  ],
  sun: [
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
    {
      time: '오전 10:00',
      type: 'interview',
      count: 2,
    },
  ],
} as const satisfies Record<string, { time: string; type: TimeSlotType; count: number }[]>;

const WeekName = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
} as const;

export default function WeekendSection() {
  return (
    <section className="flex flex-wrap justify-between gap-4">
      {Object.entries(CalendarData).map(([week, data], i) => (
        <div key={i} className="flex grow flex-col gap-5">
          <div className="bg-jd-gray-light flex h-[40px] w-full items-center justify-center rounded-[10px] text-2xl font-semibold">
            {WeekName[week as keyof typeof WeekName]}
          </div>
          <div className="flex flex-col gap-2">
            {data.map((item, i) => (
              <TimeSlot key={i} {...item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
