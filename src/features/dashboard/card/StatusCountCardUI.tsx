import Badge, { type BadgeType } from '@components/dashboard/Badge.tsx';
import { Skeleton } from '@components/Skeleton.tsx';

const STATUS_INFO = {
  byJob: {
    in: {
      status: '진행 중',
      description: '현재 모집 중인 공고',
      color: 'scarlet',
    },
    before: {
      status: '진행 전',
      description: '작성 진행 중인 공고',
      color: 'violet',
    },
    closed: {
      status: '마감',
      description: '모집이 종료된 공고',
      color: 'gray',
    },
  },
  byInterview: {
    in: {
      status: '전체 면접 수',
      description: '총 면접 예정 건수',
      color: 'scarlet',
    },
    before: {
      status: '미진행 면접',
      description: '대기/진행 중인 면접',
      color: 'violet',
    },
    closed: {
      status: '면접 완료',
      description: '완료된 면접 건수',
      color: 'gray',
    },
  },
} as const satisfies Record<
  string,
  Record<string, { status: string; description: string; color: BadgeType }>
>;

type DataType = keyof typeof STATUS_INFO;
type StatusType = keyof (typeof STATUS_INFO)[DataType];

export default function StatusCountCardUI({
  count,
  dataType,
  statusType,
}: {
  count: number | null;
  dataType: DataType;
  statusType: StatusType;
}) {
  return (
    <section className="border-jd-gray-light flex w-full flex-row items-center justify-between rounded-[10px] border p-[20px]">
      <div className="flex flex-col">
        <h3 className="font-bold">{STATUS_INFO[dataType][statusType].status}</h3>
        <p className="text-jd-gray-dark text-sm">{STATUS_INFO[dataType][statusType].description}</p>
      </div>
      {count == null ? (
        <Skeleton className="h-[30px] rounded-3xl pt-[5px] pr-[20px] pb-[5px] pl-[20px]" />
      ) : (
        <Badge text={count + '개'} color={STATUS_INFO[dataType][statusType].color} />
      )}
    </section>
  );
}
