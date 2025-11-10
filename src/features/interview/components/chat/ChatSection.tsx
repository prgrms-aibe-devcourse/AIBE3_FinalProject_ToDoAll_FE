import React, { useState } from 'react';
import type { Message } from '../../types/chatroom';

interface ChatSectionProps {
  initialMessages: Message[];
}

export default function ChatSection({ initialMessages }: ChatSectionProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), text: newMessage, isMine: true }]);
    setNewMessage('');
  };

  return (
    <div className="flex flex-col flex-1 max-h-full bg-white border border-jd-gray-light rounded-2xl shadow-md p-6 overflow-hidden">
      {/* 채팅 리스트 */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.isMine ? 'justify-end' : 'justify-start'}`}>
            {!m.isMine && (
              <img
                src="https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg"
                alt="상대방 프로필"
                className="w-8 h-8 rounded-full border mr-3 border-jd-gray-light"
              />
            )}
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] ${
                m.isMine
                  ? 'bg-jd-gray-light text-jd-black shadow'
                  : 'bg-white border border-jd-gray-light text-jd-black shadow'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* 입력창 */}
      <div className="flex-shrink-0">
        <div className="flex items-center border border-jd-gray-light rounded-full px-4 py-1.5 w-full bg-white shadow-sm">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-jd-black placeholder-jd-gray-black"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="gray"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
