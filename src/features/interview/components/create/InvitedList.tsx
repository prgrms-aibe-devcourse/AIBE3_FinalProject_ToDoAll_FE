import type { Interviewer } from '../../types/interviewer';

interface Props {
  invited: Interviewer[];
  /* eslint-disable-next-line no-unused-vars */
  handleRemove: (id: number) => void;
}

export default function InvitedList({ invited, handleRemove }: Props) {
  return (
    <div className="mt-2 flex-1 overflow-y-auto pr-1">
      {invited.length > 0 ? (
        <div className="space-y-3">
          {invited.map((i) => (
            <div
              key={i.id}
              className="relative flex items-center rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-md"
            >
              <div className="flex items-center gap-3">
                <img
                  src={i.avatar ?? '/images/default-profile.jpg'}
                  alt={i.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-gray-800">{i.name}</span>
                  <span className="text-sm font-light text-gray-800">{i.email}</span>
                </div>
              </div>

              {/* 오른쪽 상단 X 버튼 */}
              <button
                onClick={() => handleRemove(i.id)}
                className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600 transition hover:bg-gray-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-6 text-center text-sm text-gray-400">초대한 면접관이 없습니다.</p>
      )}
    </div>
  );
}
