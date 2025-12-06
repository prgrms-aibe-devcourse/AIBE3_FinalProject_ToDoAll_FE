interface InterviewButtonProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'question';
  onClick?: () => void;
}

export default function InterviewButton({
  label,
  variant = 'default',
  onClick,
}: InterviewButtonProps) {
  const baseStyle = 'font-semibold px-5 py-2 rounded-lg transition-colors';

  const variants = {
    default: 'bg-jd-gray-light text-jd-black hover:bg-jd-gray-light-hover',
    primary: 'bg-jd-violet text-jd-white hover:bg-jd-violet-hover',
    success: 'bg-jd-green text-jd-white hover:bg-jd-green-hover',
    question: 'bg-jd-yellow text-jd-black hover:bg-jd-yellow-hover',
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {label}
    </button>
  );
}
