import DetailButton from '@components/dashboard/DetailButton.tsx';

import useFetch from '@/hooks/useFetch.ts';
import SelectIcon from '@components/SelectIcon.tsx';
import { Skeleton } from '@components/Skeleton.tsx';

type SummationCardProps = {
  title: string;
  description: string;
  detailUrl: string;
  fetchUrl: string;
  iconName?: string;
};

export default function SummationCardUI({
  title,
  description,
  detailUrl,
  fetchUrl,
  iconName = 'book-text',
}: SummationCardProps) {
  const { resData } = useFetch<number>(fetchUrl);

  return (
    <div className="jd-dashboard-section relative flex aspect-[12/8] w-full max-w-sm flex-col justify-between rounded-[20px] bg-white p-[30px] md:max-w-[279px]">
      <h2 className="text-jd-gray-dark mb-[20px] font-bold">{title}</h2>
      <div>
        {resData == null ? (
          <Skeleton className="h-[2.25rem] w-full" />
        ) : (
          <h3 className="text-4xl font-semibold text-gray-700">{resData}</h3>
        )}
        <p className="text-sm font-light text-gray-500">{description}</p>
      </div>
      <DetailButton className="relative top-3" url={detailUrl} />
      <SelectIcon
        name={iconName}
        className="text-jd-gray-dark absolute top-[30px] right-[30px]"
        customize={{ size: 20 }}
      />
    </div>
  );
}
