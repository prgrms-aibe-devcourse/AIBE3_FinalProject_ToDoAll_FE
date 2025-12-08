// src/pages/InterviewChatRoomGuest.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import ChatSection from '../components/chat/ChatSection';
import useInterviewSocket from '@/hooks/useInterviewSocket';
import { MessageType, type OutgoingChatMessage } from '@/features/interview/types/chatroom';

import { getResumeWithGuestToken } from '@/features/interview/api/profile.api';
import { getInterviewDetailWithGuestToken } from '@/features/interview/api/interview-detail.api';
import {
  getChatHistoryWithGuestToken,
  type ChatMessage,
} from '@/features/interview/api/question.api';
import { getPresignedDownloadUrlWithGuestToken } from '@/features/interview/api/file.api';

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

  const [candidateAvatar, setCandidateAvatar] = useState<string>(DEFAULT_AVATAR);
  const [resumeId, setResumeId] = useState<number | null>(null);

  // echo 제거
  const pendingRef = useRef<{ content: string; at: number }[]>([]);
  const cleanupPending = useCallback(() => {
    const now = Date.now();
    pendingRef.current = pendingRef.current.filter((p) => now - p.at < 7000);
  }, []);

  // ✅ “상대방 senderId” 추정: isMine=false 메시지들 중 첫 번째 senderId
  const otherSenderId = useMemo(() => {
    const firstOther = messages.find((m) => !m.isMine);
    return firstOther?.senderId;
  }, [messages]);

  // INIT
  useEffect(() => {
    console.log('[GUEST INIT]', { interviewId, token: interviewToken ? 'YES' : 'NO' });
  }, [interviewId, interviewToken]);

  // 인터뷰 상세
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

  // 히스토리
  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;
    if (!interviewToken) return;

    (async () => {
      try {
        const history = await getChatHistoryWithGuestToken(interviewId, interviewToken);

        console.log(
          '[GUEST HISTORY senderIds]',
          Array.from(new Set(history.map((x) => x.senderId)))
        );
        console.log('[GUEST HISTORY sample]', history.slice(0, 5));

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

  // WS 수신
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

  /**
   * ✅ “지원자(상대방)” 아바타를 presigned로 세팅
   * - senderId=0에 박지 않고, 실제로 화면에 등장하는 otherSenderId에 박는다.
   */
  useEffect(() => {
    if (!interviewToken) return;
    if (!otherSenderId) return; // 아직 메시지가 없으면 못 정함

    (async () => {
      try {
        // 1) candidateAvatar가 절대 URL이면 우선
        if (candidateAvatar && candidateAvatar !== DEFAULT_AVATAR) {
          setAvatarBySender((prev) => ({ ...prev, [otherSenderId]: candidateAvatar }));
          return;
        }

        // 2) resumeId -> fileKey -> presigned
        if (!resumeId) {
          setAvatarBySender((prev) => ({ ...prev, [otherSenderId]: DEFAULT_AVATAR }));
          return;
        }

        const resume = await getResumeWithGuestToken(resumeId, interviewToken);
        const fileKey = resume.resumeFileUrl;

        console.log('[GUEST CANDIDATE AVATAR] resume', resume);
        console.log('[GUEST CANDIDATE AVATAR] fileKey', fileKey);

        if (!fileKey) {
          setAvatarBySender((prev) => ({ ...prev, [otherSenderId]: DEFAULT_AVATAR }));
          return;
        }

        const presigned = await getPresignedDownloadUrlWithGuestToken(fileKey, interviewToken);
        console.log('[GUEST CANDIDATE AVATAR] presigned OK', presigned);

        setAvatarBySender((prev) => ({ ...prev, [otherSenderId]: presigned }));
      } catch (e) {
        console.error('[GUEST CANDIDATE AVATAR] FAIL', e);
        setAvatarBySender((prev) => ({ ...prev, [otherSenderId]: DEFAULT_AVATAR }));
      }
    })();
  }, [interviewToken, resumeId, candidateAvatar, otherSenderId]);

  // (옵션) 나머지 senderId들은 기본 아바타 세팅
  useEffect(() => {
    const senderIds = Array.from(new Set(messages.map((m) => m.senderId)));
    const missing = senderIds.filter(
      (id) => !avatarBySender[id] && !loadingAvatarRef.current.has(id)
    );
    if (missing.length === 0) return;

    missing.forEach((id) => loadingAvatarRef.current.add(id));

    const updates: Record<number, string> = {};
    missing.forEach((id) => (updates[id] = DEFAULT_AVATAR));

    missing.forEach((id) => loadingAvatarRef.current.delete(id));
    setAvatarBySender((prev) => ({ ...prev, ...updates }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]); // avatarBySender deps 제외

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
          getAvatarForSender={(senderId) => avatarBySender[senderId]}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}
