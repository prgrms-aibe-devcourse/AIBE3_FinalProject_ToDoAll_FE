import { ArrowRight } from 'lucide-react';
import cn from '../../lib/utils/cn.ts';

export default function DetailButton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex justify-center items-center w-fit font-semibold text-jd-gray-dark',
        className
      )}
    >
      <ArrowRight size="15px" className="mr-[2px]" />
      <p className="text-sm">상세 보기</p>
    </div>
  );
}
