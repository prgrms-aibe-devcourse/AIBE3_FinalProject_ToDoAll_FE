import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import ChatSection from '../components/chat/ChatSection';
import useInterviewSocket from '@shared/hooks/useInterviewSocket';
import { MessageType, type OutgoingChatMessage } from '@/features/interview/types/chatroom';

import { getInterviewDetailWithGuestToken } from '@/features/interview/api/interview-detail.api';
import {
  getChatHistoryWithGuestToken,
  type ChatMessage,
} from '@/features/interview/api/question.api';

import { DEFAULT_AVATAR, normalizeAvatarUrl } from '../util/avatar';

type UiMsg = { id: number; text: string; senderId: number; isMine: boolean };
const GUEST_SENDER_ID = 0;

export default function InterviewChatRoomGuest() {
  const { interviewId: interviewIdParam } = useParams();
  const [searchParams] = useSearchParams();

  const interviewId = Number(interviewIdParam);
  const interviewToken = searchParams.get('token') ?? undefined;

  const [messages, setMessages] = useState<UiMsg[]>([]);
  const [avatarBySender, setAvatarBySender] = useState<Record<number, string>>({});
  const loadingAvatarRef = useRef<Set<number>>(new Set());

  const [_candidateAvatar, setCandidateAvatar] = useState<string>(DEFAULT_AVATAR);
  const [_resumeId, setResumeId] = useState<number | null>(null);

  const pendingRef = useRef<{ content: string; at: number }[]>([]);
  const cleanupPending = useCallback(() => {
    const now = Date.now();
    pendingRef.current = pendingRef.current.filter((p) => now - p.at < 7000);
  }, []);

  const otherSenderId = useMemo(() => {
    const firstOther = messages.find((m) => !m.isMine);
    return firstOther?.senderId;
  }, [messages]);

  useEffect(() => {
    console.log('[GUEST INIT]', { interviewId, token: interviewToken ? 'YES' : 'NO' });
  }, [interviewId, interviewToken]);

  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;
    if (!interviewToken) return;

    (async () => {
      try {
        const detail = await getInterviewDetailWithGuestToken(interviewId, interviewToken);
        console.log('[GUEST DETAIL]', detail);

        setResumeId(detail.resumeId ?? null);

        if (detail.candidateAvatar) {
          setCandidateAvatar(normalizeAvatarUrl(detail.candidateAvatar) ?? DEFAULT_AVATAR);
        } else {
          setCandidateAvatar(DEFAULT_AVATAR);
        }
      } catch (e) {
        console.error('[GUEST DETAIL FAIL]', e);
      }
    })();
  }, [interviewId, interviewToken]);

  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;
    if (!interviewToken) return;

    (async () => {
      try {
        const history = await getChatHistoryWithGuestToken(interviewId, interviewToken);

        const mapped: UiMsg[] = history.map((m: ChatMessage) => ({
          id: m.id,
          text: m.content,
          senderId: Number(m.senderId),
          isMine: Number(m.senderId) === GUEST_SENDER_ID, // 서버가 0을 안 주면 여기부터 틀어질 수 있음
        }));

        setMessages(mapped);
      } catch (e) {
        console.error('[GUEST HISTORY FAIL]', e);
      }
    })();
  }, [interviewId, interviewToken]);

  const handleChatMessage = useCallback(
    (msg: any) => {
      const incoming = String(msg?.content ?? '').trim();
      if (!incoming) return;

      const now = Date.now();
      cleanupPending();

      const dupIdx = pendingRef.current.findIndex((p) => p.content === incoming);
      if (dupIdx !== -1) {
        pendingRef.current.splice(dupIdx, 1);
        return;
      }

      const senderId = Number(msg?.senderId);
      setMessages((prev) => [
        ...prev,
        { id: now, text: incoming, senderId, isMine: senderId === GUEST_SENDER_ID },
      ]);
    },
    [cleanupPending]
  );

  const { sendChat } = useInterviewSocket({
    interviewId,
    onChatMessage: handleChatMessage,
    isGuest: true,
    guestToken: interviewToken,
  });

  useEffect(() => {
    if (!otherSenderId) return;

    // 상대방 프로필을 항상 default-profile.jpg로 설정
    setAvatarBySender((prev) => ({ ...prev, [otherSenderId]: '/images/default-profile.jpg' }));
  }, [otherSenderId]);

  useEffect(() => {
    const senderIds = Array.from(new Set(messages.map((m) => m.senderId)));
    const missing = senderIds.filter(
      (id) => !avatarBySender[id] && !loadingAvatarRef.current.has(id)
    );
    if (missing.length === 0) return;

    missing.forEach((id) => loadingAvatarRef.current.add(id));

    const updates: Record<number, string> = {};
    missing.forEach((id) => {
      // 상대방(otherSenderId)인 경우 default-profile.jpg 사용, 나머지는 DEFAULT_AVATAR
      updates[id] = id === otherSenderId ? '/images/default-profile.jpg' : DEFAULT_AVATAR;
    });

    missing.forEach((id) => loadingAvatarRef.current.delete(id));
    setAvatarBySender((prev) => ({ ...prev, ...updates }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, otherSenderId]);

  const handleSend = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    pendingRef.current.push({ content: trimmed, at: Date.now() });

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: trimmed, senderId: GUEST_SENDER_ID, isMine: true },
    ]);

    const payload: OutgoingChatMessage = {
      type: MessageType.CHAT,
      interviewId,
      senderId: GUEST_SENDER_ID,
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
        <ChatSection
          initialMessages={messages}
          getAvatarForSender={(senderId) => {
            // 상대방(내가 아닌 사람)은 항상 default-profile.jpg 사용
            if (senderId !== GUEST_SENDER_ID) {
              return '/images/default-profile.jpg';
            }
            return avatarBySender[senderId];
          }}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
