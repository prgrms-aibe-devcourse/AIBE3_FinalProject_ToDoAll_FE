// src/hooks/useInterviewSocket.ts
import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage, IFrame } from '@stomp/stompjs';
import type {
  OutgoingChatMessage,
  IncomingNoteMessage,
} from '@features/interview/types/chatroom.ts';
import { toNumId } from '@features/interview/util/avatar.ts';

type AnyObj = Record<string, any>;

interface UseInterviewSocketProps {
  interviewId: number;
  onChatMessage?: (_msg: AnyObj) => void; // 디버그 동안 Any
  onNoteMessage?: (_msg: IncomingNoteMessage) => void;
  onSystemMessage?: (_msg: any) => void;
  isGuest?: boolean;
  guestToken?: string;
}

function maskToken(token?: string | null) {
  if (!token) return undefined;
  if (token.length <= 10) return token;
  return `${token.slice(0, 6)}...${token.slice(-4)}`;
}

export default function useInterviewSocket({
  interviewId,
  onChatMessage,
  onNoteMessage,
  onSystemMessage,
  isGuest = false,
  guestToken,
}: UseInterviewSocketProps) {
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<Set<string>>(new Set());

  const chatRef = useRef(onChatMessage);
  const noteRef = useRef(onNoteMessage);
  const systemRef = useRef(onSystemMessage);

  useEffect(() => {
    chatRef.current = onChatMessage;
    noteRef.current = onNoteMessage;
    systemRef.current = onSystemMessage;
  }, [onChatMessage, onNoteMessage, onSystemMessage]);

  useEffect(() => {
    if (!interviewId) return;
    const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

    // 배포(https 페이지)에서는 API도 https로 강제
    const apiUrl =
      window.location.protocol === 'https:'
        ? rawApiUrl.replace(/^http:\/\//, 'https://')
        : rawApiUrl;

    const wsUrl = `${apiUrl.replace(/\/$/, '')}/ws/interview`;
    const socket = new SockJS(wsUrl);

    const accessToken = !isGuest ? localStorage.getItem('accessToken') : '';
    console.log('[WS INIT]', {
      interviewId,
      wsUrl,
      isGuest,
      accessToken: maskToken(accessToken),
      guestToken: maskToken(guestToken),
    });

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      connectHeaders: {
        interviewId: `${interviewId}`,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(isGuest && guestToken ? { 'Interview-Token': guestToken } : {}),
      },
      debug: (str) => {
        if (import.meta.env.DEV) console.log('[STOMP DEBUG]', str);
      },

      onConnect: () => {
        console.log('%c[WS CONNECTED]', 'color: green', { interviewId, isGuest });

        const chatTopic = `/topic/interview/${interviewId}/chat`;
        const noteTopic = `/topic/interview/${interviewId}/note`;
        const systemTopic = `/topic/interview/${interviewId}/system`;

        if (!subscriptionsRef.current.has(chatTopic)) {
          client.subscribe(chatTopic, (msg: IMessage) => {
            let body: AnyObj;
            try {
              body = JSON.parse(msg.body);
            } catch {
              console.error('[WS CHAT PARSE FAIL]', msg.body);
              return;
            }

            const senderId = toNumId(
              body.senderId ?? body.sender_id ?? body.senderID ?? body.userId ?? body.user_id,
              -1
            );

            const normalized: AnyObj = { ...body, senderId };

            console.log('[WS CHAT RAW]', body);
            console.log('[WS CHAT NORMALIZED]', {
              senderId: normalized.senderId,
              sender: normalized.sender,
              content: normalized.content,
              keys: Object.keys(body),
            });

            chatRef.current?.(normalized);
          });
          subscriptionsRef.current.add(chatTopic);
        }

        if (!isGuest && !subscriptionsRef.current.has(noteTopic)) {
          client.subscribe(noteTopic, (msg: IMessage) => {
            try {
              noteRef.current?.(JSON.parse(msg.body));
            } catch {
              console.error('[WS NOTE PARSE FAIL]', msg.body);
            }
          });
          subscriptionsRef.current.add(noteTopic);
        }

        if (!subscriptionsRef.current.has(systemTopic)) {
          client.subscribe(systemTopic, (msg: IMessage) => {
            let body: any = msg.body;
            try {
              body = JSON.parse(msg.body);
            } catch {
              // JSON 파싱 실패 시 원본 body 사용
            }
            console.log('[WS SYSTEM]', body);
            systemRef.current?.(body);
          });
          subscriptionsRef.current.add(systemTopic);
        }
      },

      onDisconnect: () => console.log('[WS DISCONNECTED]'),

      onStompError: (frame: IFrame) => {
        console.error('[STOMP ERROR]', {
          message: frame.headers['message'] || '',
          headers: frame.headers,
          body: frame.body,
        });
      },

      onWebSocketError: (err: Event) => {
        console.error('[WS ERROR] WebSocket 연결 에러:', err);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
      const subscriptions = subscriptionsRef.current;
      subscriptions.clear();
    };
  }, [interviewId, isGuest, guestToken]);

  const sendChat = (message: OutgoingChatMessage) => {
    console.log('[WS SEND CHAT]', message);

    if (!clientRef.current?.connected) {
      console.warn('[WS] 연결되지 않음 - 메시지 전송 실패');
      return;
    }

    clientRef.current.publish({
      destination: `/app/interview/${interviewId}/chat`,
      body: JSON.stringify(message),
    });
  };

  const sendNote = (content: string) => {
    if (isGuest) return;
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: `/app/interview/${interviewId}/note`,
      body: JSON.stringify({ content }),
    });
  };

  return { sendChat, sendNote };
}
