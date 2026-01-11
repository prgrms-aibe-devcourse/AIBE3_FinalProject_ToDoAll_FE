import SelectIcon from '@components/SelectIcon.tsx';
import cn from '@lib/utils/cn.ts';

export default function BlankCard({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col items-center justify-center gap-5 pt-10 pb-10 font-bold opacity-40',
        className
      )}
    >
      <SelectIcon name="circle-dashed" customize={{ size: 30, strokeWidth: 2.5 }} />
      {text}
    </div>
  );
}
