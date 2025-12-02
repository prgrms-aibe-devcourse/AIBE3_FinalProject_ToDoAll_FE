import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import QuestionNoteSection from '../components/chat/QuestionNoteSection';
import InterviewSummarySection from '../components/chat/InterviewSummarySection';

import { useEffect, useState } from 'react';

import {
  getMe,
  getChatHistory,
  getInterviewMemos,
  type ChatMessage,
} from '@/features/user/api/user.api';

import useInterviewSocket from '@/hooks/useInterviewSocket';

// ⭐ 반드시 import 해야 함
import { MessageType, type OutgoingChatMessage, type QuestionSection } from '../types/chatroom';

export default function InterviewChatRoomPage() {
  const location = useLocation();
  const { interviewId: interviewIdParam } = useParams();

  const navigate = useNavigate();
  const numericInterviewId = Number(interviewIdParam);

  const [me, setMe] = useState<any>(null);
  const [messages, setMessages] = useState<
    { id: number; text: string; senderId: number; isMine: boolean }[]
  >([]);
  const [questionNotes, setQuestionNotes] = useState<QuestionSection[]>([]);

  // 초기 로그
  useEffect(() => {
    console.log('🔍 InterviewChatRoomPage 초기화:', {
      interviewIdParam,
      numericInterviewId,
      state: location.state,
    });
  }, [interviewIdParam, numericInterviewId, location.state]);

  // 1) 사용자 정보 로드
  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();
        setMe(user);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    })();
  }, []);

  // 2) 채팅 내역 로드 (me 없이도 즉시 로드)
  useEffect(() => {
    if (!numericInterviewId) {
      console.error('❌ 잘못된 interviewId:', interviewIdParam);
      return;
    }

    (async () => {
      try {
        const history = await getChatHistory(numericInterviewId);

        const mapped = history.map((m: ChatMessage) => ({
          id: m.id,
          text: m.content,
          senderId: m.senderId,
          isMine: false, // me가 로드되면 나중에 업데이트됨
        }));

        setMessages(mapped);
      } catch (e) {
        console.error('채팅 내역 불러오기 실패:', e);
      }
    })();
  }, [numericInterviewId, interviewIdParam]);

  // 3) me가 로드된 후 isMine 업데이트
  useEffect(() => {
    if (!me) return;

    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        isMine: m.senderId === me.id,
      }))
    );
  }, [me]);

  // 4) 메모 로드
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        const memos = await getInterviewMemos(numericInterviewId);

        const map = new Map<string, string[]>();

        memos.forEach((memo: any) => {
          const author = memo.author?.name ?? '익명';
          if (!map.has(author)) map.set(author, []);
          map.get(author)!.push(memo.content);
        });

        setQuestionNotes(
          Array.from(map.entries()).map(([topic, questions]) => ({
            topic,
            questions,
          }))
        );
      } catch (e) {
        console.error('메모 불러오기 실패:', e);
      }
    })();
  }, [numericInterviewId]);

  // 5) WebSocket 연결 (쿠키 기반 인증)
  const { sendChat } = useInterviewSocket({
    interviewId: numericInterviewId,
    onChatMessage: (msg: OutgoingChatMessage) => {
      setMessages((prev) => {
        // 중복 메시지 체크 (같은 내용과 senderId를 가진 메시지가 이미 있으면 추가하지 않음)
        const isDuplicate = prev.some(
          (m) =>
            m.text === msg.content &&
            m.senderId === msg.senderId &&
            Math.abs(m.id - Date.now()) < 5000
        );
        if (isDuplicate) {
          return prev;
        }

        return [
          ...prev,
          {
            id: Date.now(),
            text: msg.content,
            senderId: msg.senderId,
            isMine: msg.senderId === me?.id,
          },
        ];
      });
    },
  });

  // 6) 메시지 전송 (낙관적 업데이트)
  const handleSend = (content: string) => {
    if (!me) {
      console.warn('⚠️ 사용자 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      text: content,
      senderId: me.id,
      isMine: true,
    };

    // 즉시 화면에 추가 (낙관적 업데이트)
    setMessages((prev) => [...prev, newMessage]);

    const payload: OutgoingChatMessage = {
      type: MessageType.CHAT,
      interviewId: numericInterviewId,
      senderId: me.id,
      sender: me.name ?? me.nickname ?? '사용자',
      content,
    };

    console.log('📤 WebSocket 전송:', payload);
    sendChat(payload);
  };

  const handleEndInterview = () => {
    navigate('/interview/manage');
  };

  // ==========================
  // 7) UI 렌더링
  // ==========================
  return (
    <div className="bg-jd-white text-jd-black flex h-screen flex-col overflow-hidden">
      <header className="flex h-20 shrink-0 items-center justify-between px-10 py-6">
        <h1 className="text-jd-black text-3xl font-semibold">면접</h1>
        <button
          onClick={handleEndInterview}
          className="bg-jd-yellow hover:bg-jd-yellow-hover text-m rounded-lg px-6 py-2 font-semibold text-white transition"
        >
          면접 종료
        </button>
      </header>

      <div className="flex flex-1 gap-6 overflow-hidden px-8 pb-8">
        <div className="flex h-full flex-1 gap-6 overflow-hidden">
          <ChatSection initialMessages={messages} onSend={handleSend} />
          <QuestionNoteSection questionNotes={questionNotes} />
          <InterviewSummarySection summaries={[]} currentUserId={me?.id} />
        </div>
      </div>
    </div>
  );
}
