import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import useInterviewSocket from '@/hooks/useInterviewSocket';
import { MessageType, type OutgoingChatMessage } from '@/features/interview/types/chatroom';

export default function InterviewChatRoomGuest() {
  const { interviewId: interviewIdParam } = useParams();
  const interviewId = Number(interviewIdParam);

  const [messages, setMessages] = useState<
    { id: number; text: string; senderId: number; isMine: boolean }[]
  >([]);

  const { sendChat } = useInterviewSocket({
    interviewId,
    onChatMessage: (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: msg.content,
          senderId: msg.senderId ?? 0,
          isMine: false,
        },
      ]);
    },
  });

  const handleSend = (content: string) => {
    const payload: OutgoingChatMessage = {
      type: MessageType.CHAT,
      interviewId,
      senderId: 0,
      sender: 'Guest',
      content,
    };

    sendChat(payload);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: content,
        senderId: 0,
        isMine: true,
      },
    ]);
  };

  return (
    <div className="bg-jd-white text-jd-black flex h-screen flex-col overflow-hidden">
      <header className="justify-left flex h-20 shrink-0 items-center px-10 py-6">
        <h1 className="text-jd-black text-3xl font-semibold">인터뷰</h1>
      </header>

      <div className="flex flex-1 overflow-hidden px-8 pb-8">
        <ChatSection initialMessages={messages} onSend={handleSend} />
      </div>
    </div>
  );
}
