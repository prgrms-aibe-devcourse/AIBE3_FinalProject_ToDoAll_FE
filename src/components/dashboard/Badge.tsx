import { cva, type VariantProps } from 'class-variance-authority';
import cn from '@lib/utils/cn.ts';

export type BadgeType = 'default' | 'scarlet' | 'violet' | 'gray';

const BadgeVariants = cva(
  `w-fit h-[30px] rounded-3xl text-sm font-light text-white pl-[20px] pr-[20px] pt-[5px] pb-[5px]`,
  {
    variants: {
      color: {
        default: 'bg-jd-scarlet',
        scarlet: 'bg-jd-scarlet',
        violet: 'bg-jd-violet',
        gray: 'bg-jd-gray-dark',
      },
    },
  }
);

interface BadgeProps extends VariantProps<typeof BadgeVariants> {
  className?: string;
  text: string;
  color: BadgeType;
}

export default function Badge({ text, color = 'default', className }: BadgeProps) {
  return <section className={cn(BadgeVariants({ color, className }))}>{text}</section>;
}
