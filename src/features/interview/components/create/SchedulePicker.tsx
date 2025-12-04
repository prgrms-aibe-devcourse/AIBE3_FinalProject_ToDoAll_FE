interface SchedulePickerProps {
  date: string;
  time: string;
  setDate: (_value: string) => void;
  setTime: (_value: string) => void;
}

export default function SchedulePicker({ date, time, setDate, setTime }: SchedulePickerProps) {
  return (
    <div className="mt-6 rounded-2xl bg-gray-100 p-6">
      <p className="mb-3 font-medium text-gray-700">면접 일자</p>

      <div className="flex gap-3">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-40 rounded-lg border bg-white px-3 py-2 text-gray-700 shadow-sm"
        />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-32 rounded-lg border bg-white px-3 py-2 text-gray-700 shadow-sm"
        />
      </div>
    </div>
  );
}
