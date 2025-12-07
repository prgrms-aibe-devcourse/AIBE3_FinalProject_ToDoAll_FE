import { ArrowRight } from 'lucide-react';
import cn from '@lib/utils/cn.ts';

export default function DetailButton({ className, url }: { className?: string; url: string }) {
  return (
    <a href={url} rel="noopener noreferrer">
      <div
        className={cn(
          'text-jd-gray-dark flex w-fit items-center justify-center font-semibold',
          className
        )}
      >
        <ArrowRight size="15px" className="mr-[2px]" />
        <p className="text-sm">상세 보기</p>
      </div>
    </a>
  );
}
