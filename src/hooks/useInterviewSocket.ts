// src/hooks/useInterviewSocket.ts

import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage } from '@stomp/stompjs';

interface UseInterviewSocketProps {
  interviewId: number;
  token: string;
  onChatMessage?: (_msg: any) => void;
  onNoteMessage?: (_msg: any) => void;
  onSystemMessage?: (_msg: any) => void;
}

export default function useInterviewSocket({
  interviewId,
  onChatMessage,
  onNoteMessage,
  onSystemMessage,
}: UseInterviewSocketProps) {
  const clientRef = useRef<Client | null>(null);

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

    const wsUrl = import.meta.env.VITE_WS_URL || `${window.location.origin}/ws/interview`;

    const socket = new SockJS(wsUrl);

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 3000,

      // 🔥 Authorization 제거! 쿠키 기반 인증만 사용
      connectHeaders: {
        interviewId: `${interviewId}`,
      },

      debug: () => {},

      onConnect: () => {
        console.log('%c[WS CONNECTED]', 'color: green');

        client.subscribe(`/topic/interview/${interviewId}/chat`, (msg: IMessage) => {
          const body = JSON.parse(msg.body);
          chatRef.current?.(body);
        });

        client.subscribe(`/topic/interview/${interviewId}/note`, (msg: IMessage) => {
          const body = JSON.parse(msg.body);
          noteRef.current?.(body);
        });

        client.subscribe(`/topic/interview/${interviewId}/system`, (msg: IMessage) => {
          const body = JSON.parse(msg.body);
          systemRef.current?.(body);
        });
      },

      onStompError: (frame) => {
        console.error('[STOMP ERROR]', frame.headers['message']);
      },

      onWebSocketError: (err) => {
        console.error('[WS ERROR]', err);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      console.log('%c[WS DISCONNECT]', 'color: orange');
      clientRef.current?.deactivate();
    };
  }, [interviewId]);

  const sendChat = (content: string, senderId: number, sender: string) => {
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: `/app/interview/${interviewId}/chat`,
      body: JSON.stringify({
        interviewId,
        senderId,
        sender,
        content,
      }),
    });
  };

  const sendNote = (content: string) => {
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: `/app/interview/${interviewId}/note`,
      body: JSON.stringify({ content }),
    });
  };

  return { sendChat, sendNote };
}
