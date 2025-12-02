interface InterviewButtonProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'question';
  onClick?: () => void;
}

export default function InterviewButton({
  label,
  variant = 'default',
  onClick,
}: InterviewButtonProps) {
  const baseStyle = 'font-semibold px-5 py-2 rounded-lg transition-colors';

  const variants = {
    default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: 'bg-jd-violet text-white hover:bg-jd-violet-hover',
    success: 'bg-jd-green text-gray-100 hover:bg-green-500',
    question: 'bg-jd-yellow text-black hover:bg-yellow-500',
    danger: 'bg-jd-scarlet text-white hover:bg-red-300',
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {label}
    </button>
  );
}
