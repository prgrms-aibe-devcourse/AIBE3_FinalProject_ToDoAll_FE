import { useMemo } from 'react';
import { BookText, Users, Calendar, UserCheck, ArrowRight } from 'lucide-react';

interface SelectIconProps {
  name: string;
  className: string;
  size: number;
}

export default function SelectIcon({ name, className, size }: SelectIconProps) {
  return useMemo(() => {
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
    }
  }, [className, name, size]);
}
