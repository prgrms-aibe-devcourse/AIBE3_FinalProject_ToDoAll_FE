interface InterviewHeaderProps {
  avatar: string;
  name: string;
  position: string;
  status: '전체' | '예정' | '완료' | '진행중';
}

export default function InterviewHeader({ avatar, name, position, status }: InterviewHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{position}</p>
      </div>
      <span
        className={`ml-auto text-xs px-3 py-1 rounded-full ${
          status === '진행중'
            ? 'bg-purple-900 text-white'
            : status === '완료'
              ? 'bg-green-600 text-white'
              : status === '예정'
                ? 'bg-yellow-400 text-gray-800'
                : 'bg-gray-300 text-gray-700'
        }`}
      >
        {status === '진행중' ? '면접 시작' : status}
      </span>
    </div>
  );
}
