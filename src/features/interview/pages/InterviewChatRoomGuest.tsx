import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import useInterviewSocket from '@/hooks/useInterviewSocket';
import { MessageType, type OutgoingChatMessage } from '@/features/interview/types/chatroom';

type UiMsg = { id: number; text: string; senderId: number; isMine: boolean };

export default function InterviewChatRoomGuest() {
  const { interviewId: interviewIdParam } = useParams();
  const interviewId = Number(interviewIdParam);

  const [messages, setMessages] = useState<UiMsg[]>([]);

  const pendingRef = useRef<{ content: string; at: number }[]>([]);

  const cleanupPending = () => {
    const now = Date.now();
    pendingRef.current = pendingRef.current.filter((p) => now - p.at < 7000); // 7초 유지
  };

  const { sendChat } = useInterviewSocket({
    interviewId,
    onChatMessage: (msg) => {
      const incoming = (msg.content ?? '').trim();
      if (!incoming) return;

      const now = Date.now();
      cleanupPending();

      const dupIdx = pendingRef.current.findIndex((p) => p.content === incoming);
      const isMyEcho = dupIdx !== -1;

      if (isMyEcho) {
        pendingRef.current.splice(dupIdx, 1);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: now,
          text: incoming,
          senderId: msg.senderId ?? -999,
          isMine: false,
        },
      ]);
    },
  });

  const handleSend = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    pendingRef.current.push({ content: trimmed, at: Date.now() });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmed,
        senderId: 0,
        isMine: true,
      },
    ]);

    const payload: OutgoingChatMessage = {
      type: MessageType.CHAT,
      interviewId,
      senderId: 0,
      sender: 'Guest',
      content: trimmed,
    };

    sendChat(payload);
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
