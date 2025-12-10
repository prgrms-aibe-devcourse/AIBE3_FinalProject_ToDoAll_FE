import TimeSlot, { type TimeSlotType } from '@components/dashboard/TimeSlot.tsx';
import useFetch from '@/hooks/useFetch.ts';
import { Skeleton } from '@components/Skeleton.tsx';
import { useEffect, useRef } from 'react';
import BlankCard from '@components/dashboard/BlankCard.tsx';

const WeekName = {
  mon: '월',
  tue: '화',
  wed: '수',
  thu: '목',
  fri: '금',
  sat: '토',
  sun: '일',
} as const;

interface DailyCalendarType {
  date: string; // 0000-00-00
  events: {
    id: number;
    time: 'string'; // 오전 10:00
    title: string;
    type: TimeSlotType;
  }[];
}

export interface WeeklyCalendarType {
  weekStart: string; // 0000-00-00
  weekEnd: string; // 0000-00-00
  dailyCalendars: {
    mon: DailyCalendarType;
    tue: DailyCalendarType;
    wed: DailyCalendarType;
    thu: DailyCalendarType;
    fri: DailyCalendarType;
    sat: DailyCalendarType;
    sun: DailyCalendarType;
  };
}

export default function WeekendContainer() {
  const { resData } = useFetch<WeeklyCalendarType>('/api/v1/dashboard/week-calendar');
  const isBlank = useRef(true);

  useEffect(() => {
    if (!resData) return;

    const sum = Object.entries(resData.dailyCalendars).reduce((acc, [_, date]) => {
      return acc + date.events.length;
    }, 0);

    if (sum > 0) isBlank.current = true;
  }, [resData]);

  return (
    <section className="flex flex-wrap justify-between gap-4">
      {!resData ? (
        <Skeleton className="h-36 w-full rounded-[10px]" />
      ) : isBlank.current ? (
        <BlankCard text="등록된 일정이 없습니다." />
      ) : (
        Object.entries(resData.dailyCalendars).map(([week, data], i) => (
          <div key={i} className="flex min-w-[70px] flex-1 grow flex-col gap-5">
            <div className="bg-jd-gray-light flex h-[40px] w-full items-center justify-center rounded-[10px] text-2xl font-semibold">
              {WeekName[week as keyof typeof WeekName]}
            </div>
            <div className="flex flex-col gap-2">
              {data.events.map((item, i) => (
                <TimeSlot key={i} {...item} />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
