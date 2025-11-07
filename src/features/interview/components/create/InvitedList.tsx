import type { Interviewer } from '../../types/interviewer';

interface Props {
  invited: Interviewer[];
  /* eslint-disable-next-line no-unused-vars */
  handleRemove: (id: number) => void;
}

export default function InvitedList({ invited, handleRemove }: Props) {
  return (
    <div className="flex-1 overflow-y-auto pr-1 mt-2">
      {invited.length > 0 ? (
        <div className="space-y-3">
          {invited.map((i) => (
            <div
              key={i.id}
              className="relative flex items-center border border-gray-200 rounded-xl shadow-md px-4 py-3 bg-white"
            >
              <div className="flex items-center gap-3">
                <img src={i.avatar} alt={i.name} className="w-10 h-10 rounded-full object-cover" />
                <span className="text-gray-800 font-medium">{i.name}</span>
              </div>

              {/* 오른쪽 상단 X 버튼 */}
              <button
                onClick={() => handleRemove(i.id)}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center 
                           bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 text-xs 
                           transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm text-center py-6">초대한 면접관이 없습니다.</p>
      )}
    </div>
  );
}
