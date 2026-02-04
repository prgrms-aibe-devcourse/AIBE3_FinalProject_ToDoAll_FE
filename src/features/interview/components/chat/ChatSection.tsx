import { useEffect, useRef, useState } from 'react';
import { DEFAULT_AVATAR } from '../../util/avatar';

type UiMsg = { id: number; text: string; senderId: number; isMine: boolean };

interface ChatSectionProps {
  initialMessages: UiMsg[];
  getAvatarForSender?: (_senderId: number) => string | undefined;
  onSend?: (_content: string) => void;
}

export default function ChatSection({
  initialMessages,
  getAvatarForSender,
  onSend,
}: ChatSectionProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    console.log(initialMessages);
  }, [initialMessages]);

  const handleSend = () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setNewMessage('');
  };

  return (
    <div className="border-jd-gray-light flex h-[calc(100dvh-160px)] flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-md sm:h-full md:flex-4">
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mb-4 flex-1 space-y-3 overflow-y-auto pr-2">
        {initialMessages.length === 0 ? (
          <div className="text-jd-gray-black flex h-full items-center justify-center text-sm">
            채팅 내역이 없습니다.
          </div>
        ) : (
          <>
            {initialMessages.map((m) => {
              const avatarUrl = !m.isMine
                ? (getAvatarForSender?.(m.senderId) ?? DEFAULT_AVATAR)
                : undefined;

              return (
                <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
                  {!m.isMine && (
                    <img
                      src={avatarUrl}
                      alt="상대방 프로필"
                      className="border-jd-gray-light mr-3 h-8 w-8 rounded-full border object-cover"
                      onLoad={() => console.log('[AVATAR] load OK', m.senderId, avatarUrl)}
                      onError={() => console.error('[AVATAR] load FAIL', m.senderId, avatarUrl)}
                    />
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      m.isMine
                        ? 'bg-jd-gray-light text-jd-black shadow'
                        : 'border-jd-gray-light text-jd-black border bg-white shadow'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="shrink-0">
        <div className="border-jd-gray-light flex w-full items-center rounded-full border bg-white px-4 py-1.5 shadow-sm">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="text-jd-black placeholder-jd-gray-black flex-1 bg-transparent text-sm focus:outline-none"
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            onKeyDown={(e) => {
              if (isComposing) return;
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="gray"
              className="h-4 w-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
