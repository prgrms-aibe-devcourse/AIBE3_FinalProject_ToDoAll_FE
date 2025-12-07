import LongViewContainer from '@features/dashboard/container/LongViewContainer.tsx';
import WeekendContainer, {
  type WeeklyCalendarType,
} from '@features/dashboard/container/WeekendContainer.tsx';
import useFetch from '@/hooks/useFetch.ts';

export default function CalendarSection() {
  const { resData: weeklyCalendar } = useFetch<WeeklyCalendarType>(
    '/api/v1/dashboard/week-calendar'
  );
  if (!weeklyCalendar) return <div></div>;

  return (
    <LongViewContainer
      title={'이번 주 캘린더'}
      description={'주간 일정 개요'}
      className="jd-LongViewContainerCard-RWD-full"
      detailUrl={'#'}
    >
      <WeekendContainer calendarData={weeklyCalendar} />
    </LongViewContainer>
  );
}
