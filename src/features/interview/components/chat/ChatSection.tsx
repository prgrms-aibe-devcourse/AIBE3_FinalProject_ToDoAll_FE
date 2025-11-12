import { useState } from 'react';
import type { Message } from '../../types/chatroom';

interface ChatSectionProps {
  initialMessages: Message[];
  avatar?: string;
}

export default function ChatSection({ initialMessages, avatar }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, isMine: true }]);
    setNewMessage('');
  };

  return (
    <div className="border-jd-gray-light flex max-h-full flex-1 flex-col overflow-hidden rounded-2xl border bg-white p-6 shadow-md">
      {/* 채팅 리스트 */}
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent mb-4 flex-1 space-y-3 overflow-y-auto pr-2">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
            {!m.isMine && (
              <img
                src={avatar}
                alt="상대방 프로필"
                className="border-jd-gray-light mr-3 h-8 w-8 rounded-full border"
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
        ))}
      </div>

      {/* 입력창 */}
      <div className="shrink-0">
        <div className="border-jd-gray-light flex w-full items-center rounded-full border bg-white px-4 py-1.5 shadow-sm">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="text-jd-black placeholder-jd-gray-black flex-1 bg-transparent text-sm focus:outline-none"
            onKeyDown={(e) => {
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
