import Badge, { type BadgeType } from '@components/dashboard/Badge.tsx';

const STATUS_INFO = {
  document: {
    text: '서류 접수',
    color: 'scarlet',
  },
  interview: {
    text: '면접',
    color: 'violet',
  },
  finished: {
    text: '마감',
    color: 'gray',
  },
} as const satisfies Record<string, { text: string; color: BadgeType }>;

type StatusType = keyof typeof STATUS_INFO;

export type NumberSlotsCardProps = {
  title: string;
  slotData: number[];
  status: StatusType;
};

function SlotCard({ title, value }: { title: string; value: number }) {
  return (
    <section className="flex flex-col justify-center text-center align-middle">
      <p className="text-5xl font-bold">{value}</p>
      <p className="font-semibold">{title}</p>
    </section>
  );
}

export default function NumberSlotsCard({ title, slotData, status }: NumberSlotsCardProps) {
  return (
    <section className="border-jd-gray-light relative flex flex-col items-center gap-2 rounded-[10px] border-1 bg-white p-[20px] sm:items-start">
      <Badge
        text={STATUS_INFO[status].text}
        color={STATUS_INFO[status].color}
        className="static top-[20px] right-[20px] sm:absolute"
      />
      <h3 className="text-jd-black mb-4 font-bold">{title}</h3>
      <section className="mb-[10px] flex w-full flex-row flex-wrap justify-around gap-6 sm:gap-4">
        {['지원자', '북마크', '면접', '합격'].map((item, index) => (
          <SlotCard key={index} title={item} value={slotData[index]} />
        ))}
      </section>
      <section className="bg-jd-scarlet h-[10px] w-full rounded-[90px] opacity-25"></section>
    </section>
  );
}
