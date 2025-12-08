import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage, IFrame } from '@stomp/stompjs';
import type { OutgoingChatMessage, IncomingNoteMessage } from '@/features/interview/types/chatroom';

interface UseInterviewSocketProps {
  interviewId: number;
  onChatMessage?: (_msg: OutgoingChatMessage) => void;
  onNoteMessage?: (_msg: IncomingNoteMessage) => void;
  onSystemMessage?: (_msg: any) => void;
  isGuest?: boolean; // 게스트 모드 (accessToken 없이 접속)
  guestToken?: string; // 게스트 면접 토큰 (URL 파라미터)
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

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const wsUrl = `${apiUrl.replace(/\/$/, '')}/ws/interview`;
    const socket = new SockJS(wsUrl);

    const accessToken = !isGuest ? localStorage.getItem('accessToken') : '';
    if (!isGuest && !accessToken) {
      console.warn('[WS] accessToken이 없습니다. 로그인이 필요할 수 있습니다.');
    }

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // ✅ 게스트 토큰은 Authorization이 아니라 Interview-Token으로만 보냄
      connectHeaders: {
        interviewId: `${interviewId}`,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(isGuest && guestToken ? { 'Interview-Token': guestToken } : {}),
      },

      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('[STOMP DEBUG]', str);
        }
      },

      onConnect: () => {
        console.log('%c[WS CONNECTED]', 'color: green');

        const chatTopic = `/topic/interview/${interviewId}/chat`;
        const noteTopic = `/topic/interview/${interviewId}/note`;
        const systemTopic = `/topic/interview/${interviewId}/system`;

        // ✅ chat 구독
        if (!subscriptionsRef.current.has(chatTopic)) {
          client.subscribe(chatTopic, (msg: IMessage) => {
            chatRef.current?.(JSON.parse(msg.body));
          });
          subscriptionsRef.current.add(chatTopic);
        }

        // ✅ 게스트는 note 구독 금지 (서버에서 차단하므로 구독하면 에러 남)
        if (!isGuest && !subscriptionsRef.current.has(noteTopic)) {
          client.subscribe(noteTopic, (msg: IMessage) => {
            noteRef.current?.(JSON.parse(msg.body));
          });
          subscriptionsRef.current.add(noteTopic);
        }

        // system은 게스트에게 보여줄지 정책에 따라 유지/차단 가능
        if (!subscriptionsRef.current.has(systemTopic)) {
          client.subscribe(systemTopic, (msg: IMessage) => {
            systemRef.current?.(JSON.parse(msg.body));
          });
          subscriptionsRef.current.add(systemTopic);
        }
      },

      onDisconnect: () => {
        console.log('[WS DISCONNECTED]');
        // 구독 정보는 유지 (재연결 시 다시 구독하지 않도록)
      },

      onStompError: (frame: IFrame) => {
        const errorMessage = frame.headers['message'] || '';

        if (
          errorMessage.includes('ExecutorSubscribableChannel') ||
          errorMessage.includes('clientInboundChannel')
        ) {
          if (!isGuest) {
            const token = localStorage.getItem('accessToken');
            if (!token) {
              console.warn(
                '[STOMP WARNING] 서버 채널 에러 - accessToken이 없어 인증 문제일 수 있습니다.'
              );
            } else {
              console.warn('[STOMP WARNING] 서버 채널 에러 (일시적일 수 있음):', errorMessage);
            }
          } else {
            console.warn('[STOMP WARNING] 서버 채널 에러 (일시적일 수 있음):', errorMessage);
          }
          return;
        }

        // 인증 관련 에러는 더 명확하게 표시 (게스트 모드가 아닐 때만)
        if (
          !isGuest &&
          (errorMessage.includes('unauthorized') ||
            errorMessage.includes('authentication') ||
            errorMessage.includes('access') ||
            errorMessage.includes('token'))
        ) {
          console.error('[STOMP ERROR] 인증 실패:', errorMessage);
          const token = localStorage.getItem('accessToken');
          if (!token) {
            console.error('[STOMP ERROR] accessToken이 없습니다. 로그인이 필요합니다.');
          }
          return;
        }

        console.error('[STOMP ERROR]', {
          message: errorMessage,
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
      subscriptionsRef.current.clear();
    };
  }, [interviewId, isGuest, guestToken]);

  const sendChat = (message: OutgoingChatMessage) => {
    if (!clientRef.current?.connected) {
      console.warn('[WS] 연결되지 않음 - 메시지 전송 실패');
      return;
    }

    try {
      clientRef.current.publish({
        destination: `/app/interview/${interviewId}/chat`,
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('[WS] 메시지 전송 중 에러:', error);
    }
  };

  const sendNote = (content: string) => {
    // ✅ 게스트는 노트 전송 금지
    if (isGuest) return;

    if (!clientRef.current?.connected) {
      console.warn('[WS] 연결되지 않음 - 노트 전송 실패');
      return;
    }

    try {
      clientRef.current.publish({
        destination: `/app/interview/${interviewId}/note`,
        body: JSON.stringify({ content }),
      });
    } catch (error) {
      console.error('[WS] 노트 전송 중 에러:', error);
    }
  };

  return { sendChat, sendNote };
}
