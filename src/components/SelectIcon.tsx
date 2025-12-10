import { memo } from 'react';
import {
  BookText,
  Users,
  Calendar,
  UserCheck,
  ArrowRight,
  CircleDashed,
  type LucideProps,
} from 'lucide-react';

interface SelectIconProps {
  name: string;
  className?: string;
  customize?: LucideProps;
}

const SelectIcon = memo(function SelectIcon({ name, className, customize }: SelectIconProps) {
  switch (name) {
    case 'book-text':
      return <BookText className={className} {...customize} />;
    case 'users':
      return <Users className={className} {...customize} />;
    case 'calendar':
      return <Calendar className={className} {...customize} />;
    case 'user-check':
      return <UserCheck className={className} {...customize} />;
    case 'arrow-right':
      return <ArrowRight className={className} {...customize} />;
    case 'circle-dashed':
      return <CircleDashed className={className} {...customize} />;
    default:
      return <CircleDashed className={className} {...customize} />;
  }
});

SelectIcon.displayName = 'SelectIcon';
export default SelectIcon;
