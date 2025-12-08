import { memo } from 'react';
import { BookText, Users, Calendar, UserCheck, ArrowRight, CircleDashed } from 'lucide-react';

interface SelectIconProps {
  name: string;
  className: string;
  size: number;
}

const SelectIcon = memo(function SelectIcon({ name, className, size }: SelectIconProps) {
  switch (name) {
    case 'book-text':
      return <BookText className={className} size={size} />;
    case 'users':
      return <Users className={className} size={size} />;
    case 'calendar':
      return <Calendar className={className} size={size} />;
    case 'user-check':
      return <UserCheck className={className} size={size} />;
    case 'arrow-right':
      return <ArrowRight className={className} size={size} />;
    default:
      return <CircleDashed className={className} size={size} />;
  }
});

SelectIcon.displayName = 'SelectIcon';
export default SelectIcon;
