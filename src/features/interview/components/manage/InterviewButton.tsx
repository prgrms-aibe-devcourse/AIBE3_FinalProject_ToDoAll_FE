interface InterviewButtonProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'danger';
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
    primary: 'bg-purple-900 text-white hover:bg-purple-700',
    success: 'bg-green-500 text-gray-100 hover:bg-green-400',
    danger: 'bg-red-400 text-white hover:bg-red-300',
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]}`}>
      {label}
    </button>
  );
}
