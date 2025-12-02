import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import QuestionNoteSection from '../components/chat/QuestionNoteSection';
import InterviewSummarySection from '../components/chat/InterviewSummarySection';
import type { Message, QuestionSection } from '../types/chatroom';
import { useEffect, useState } from 'react';
import {
  getMe,
  getChatHistory,
  getInterviewMemos,
  type ChatMessage,
} from '@/features/user/api/user.api';
import useInterviewSocket from '@/hooks/useInterviewSocket';

export default function InterviewChatRoomPage() {
  const location = useLocation();
  const { interviewId: interviewIdParam } = useParams();
  const navigate = useNavigate();

  const numericInterviewId = Number(interviewIdParam);

  const [me, setMe] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionNotes, setQuestionNotes] = useState<QuestionSection[]>([]);

  // 초기 상태 로그
  useEffect(() => {
    console.log('🔍 InterviewChatRoomPage 초기화:', {
      interviewIdParam,
      numericInterviewId,
      locationState: location.state,
    });
  }, [interviewIdParam, numericInterviewId, location.state]);

  // 1) 내 정보 불러오기
  useEffect(() => {
    (async () => {
      try {
        const user = await getMe();
        console.log('🔥 Loaded me:', user);
        setMe(user);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    })();
  }, []);

  // 2) 채팅 내역 불러오기
  useEffect(() => {
    if (!numericInterviewId) {
      console.error('❌ 유효하지 않은 interviewId:', interviewIdParam);
      return;
    }

    (async () => {
      try {
        console.log('📥 채팅 내역 불러오기 시작:', numericInterviewId);
        const history = await getChatHistory(numericInterviewId);

        const mapped = history.map((m: ChatMessage) => ({
          id: m.id,
          text: m.content,
          senderId: m.senderId,
          isMine: me ? m.senderId === me.id : false,
        }));

        setMessages(mapped);
      } catch (e) {
        console.error('채팅 내역 불러오기 실패:', e);
      }
    })();
  }, [numericInterviewId, interviewIdParam, me]);

  // 3) me 로딩 후 메시지 소유자 판별 업데이트
  useEffect(() => {
    if (!me) return;

    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        isMine: m.senderId === me.id,
      }))
    );
  }, [me]);

  // 4) 메모 불러오기
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        const memos = await getInterviewMemos(numericInterviewId);

        const map = new Map<string, string[]>();
        (memos || []).forEach((memo: any) => {
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
      } catch (error) {
        console.error('메모 불러오기 실패:', error);
      }
    })();
  }, [numericInterviewId]);

  // 5) WebSocket 연결
  const { sendChat } = useInterviewSocket({
    interviewId: numericInterviewId,
    token: localStorage.getItem('accessToken') || '',
    onChatMessage: (msg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: msg.content,
          senderId: msg.senderId,
          isMine: msg.senderId === me?.id,
        },
      ]);
    },
  });

  // 6) 메시지 전송
  const handleSend = (content: string) => {
    if (!me) return;
    sendChat(content, me.id, me.name);
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
