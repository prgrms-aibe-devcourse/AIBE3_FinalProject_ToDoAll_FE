import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import type { IMessage, IFrame } from '@stomp/stompjs';
import type { OutgoingChatMessage } from '@/features/interview/types/chatroom';

interface UseInterviewSocketProps {
  interviewId: number;
  onChatMessage?: (_msg: OutgoingChatMessage) => void;
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

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const wsUrl = `${apiUrl.replace(/\/$/, '')}/ws/interview`;

    const socket = new SockJS(wsUrl);

    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 3000,

      connectHeaders: {
        interviewId: `${interviewId}`,
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },

      debug: () => {},

      onConnect: () => {
        console.log('%c[WS CONNECTED]', 'color: green');

        client.subscribe(`/topic/interview/${interviewId}/chat`, (msg: IMessage) => {
          chatRef.current?.(JSON.parse(msg.body));
        });

        client.subscribe(`/topic/interview/${interviewId}/note`, (msg: IMessage) => {
          noteRef.current?.(JSON.parse(msg.body));
        });

        client.subscribe(`/topic/interview/${interviewId}/system`, (msg: IMessage) => {
          systemRef.current?.(JSON.parse(msg.body));
        });
      },

      onStompError: (frame: IFrame) => {
        console.error('[STOMP ERROR]', {
          message: frame.headers['message'],
          headers: frame.headers,
          body: frame.body,
        });
      },

      onWebSocketError: (err: Event) => {
        console.error('[WS ERROR]', err);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      clientRef.current?.deactivate();
    };
  }, [interviewId]);

  const sendChat = (message: OutgoingChatMessage) => {
    if (!clientRef.current?.connected) return;

    clientRef.current.publish({
      destination: `/app/interview/${interviewId}/chat`,
      body: JSON.stringify(message),
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
