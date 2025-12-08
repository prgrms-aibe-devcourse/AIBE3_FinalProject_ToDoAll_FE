import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import useInterviewSocket from '@/hooks/useInterviewSocket';
import { MessageType, type OutgoingChatMessage } from '@/features/interview/types/chatroom';

import { getUserProfileAuthed } from '@/features/interview/api/profile.api';
import { DEFAULT_AVATAR, normalizeAvatarUrl } from '../util/avatar';

type UiMsg = { id: number; text: string; senderId: number; isMine: boolean };

export default function InterviewChatRoomGuest() {
  const { interviewId: interviewIdParam } = useParams();
  const [searchParams] = useSearchParams();
  const interviewId = Number(interviewIdParam);
  const interviewToken = searchParams.get('token'); // URL 파라미터의 토큰

  const [messages, setMessages] = useState<UiMsg[]>([]);
  const [peerAvatar, setPeerAvatar] = useState<string>(DEFAULT_AVATAR);

  const pendingRef = useRef<{ content: string; at: number }[]>([]);
  const lastLoadedPeerRef = useRef<number | null>(null);

  const cleanupPending = useCallback(() => {
    const now = Date.now();
    pendingRef.current = pendingRef.current.filter((p) => now - p.at < 7000);
  }, []);

  const handleChatMessage = useCallback(
    (msg: OutgoingChatMessage) => {
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
    [cleanupPending]
  );

  const { sendChat } = useInterviewSocket({
    interviewId,
    onChatMessage: handleChatMessage,
    isGuest: true, // 게스트 모드 활성화
    guestToken: interviewToken || undefined, // URL 파라미터의 토큰 전달
  });

  // 상대 아바타 로딩: senderId > 0인 상대가 보이면 1회만 호출
  useEffect(() => {
    const peer = messages.find((m) => !m.isMine && m.senderId > 0);
    if (!peer) {
      return;
    }

    if (lastLoadedPeerRef.current === peer.senderId) {
      return;
    }
    lastLoadedPeerRef.current = peer.senderId;

    let cancelled = false;
    (async () => {
      try {
        const user = await getUserProfileAuthed(peer.senderId);
        if (cancelled) return;

        const avatarUrl = normalizeAvatarUrl(user.profileUrl);
        setPeerAvatar(avatarUrl);
      } catch (e) {
        if (cancelled) return;
        console.error('[프로필] 상대방 아바타 로딩 실패:', e);
        setPeerAvatar(DEFAULT_AVATAR);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [messages]);

  const handleSend = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    pendingRef.current.push({ content: trimmed, at: Date.now() });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: trimmed,
        senderId: 0, // 게스트 senderId
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
        <ChatSection initialMessages={messages} avatar={peerAvatar} onSend={handleSend} />
      </div>
    </div>
  );
}
