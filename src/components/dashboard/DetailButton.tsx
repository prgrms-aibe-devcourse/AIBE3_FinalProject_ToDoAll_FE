import cn from '@lib/utils/cn.ts';
import SelectIcon from '@components/SelectIcon.tsx';

export default function DetailButton({ className, url }: { className?: string; url: string }) {
  return (
    <a href={url} rel="noopener noreferrer">
      <div
        className={cn(
          'text-jd-gray-dark flex w-fit items-center justify-center font-semibold',
          className
        )}
      >
        <SelectIcon name="arrow-right" className="mr-[2px]" customize={{ size: 15 }} />
        <p className="text-sm">상세 보기</p>
      </div>
    </a>
  );
}
