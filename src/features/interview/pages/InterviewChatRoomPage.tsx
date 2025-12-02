import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import QuestionNoteSection from '../components/chat/QuestionNoteSection';
import InterviewSummarySection from '../components/chat/InterviewSummarySection';

import { useEffect, useState } from 'react';

import { getMe, getChatHistory, type ChatMessage } from '@/features/user/api/user.api';

import {
  getInterviewQuestions,
  toggleQuestionCheck,
  type InterviewQuestion,
} from '@/features/interview/api/question.api';

import useInterviewSocket from '@/hooks/useInterviewSocket';

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

  // 4) 질문 로드
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        const questions = await getInterviewQuestions(numericInterviewId);

        // topic별로 그룹화 (questionType이 topic 역할)
        const map = new Map<string, InterviewQuestion[]>();

        questions.forEach((q: InterviewQuestion) => {
          const topic = q.questionType ?? '기타';
          if (!map.has(topic)) map.set(topic, []);
          map.get(topic)!.push(q);
        });

        setQuestionNotes(
          Array.from(map.entries()).map(([topic, questionList]) => ({
            topic,
            questions: questionList.map((q) => ({
              id: q.questionId, // 서버 필드
              content: q.content,
              checked: q.checked ?? false, // 서버에서 없음 → 기본 false
            })),
          }))
        );
      } catch (e) {
        console.error('질문 불러오기 실패:', e);
      }
    })();
  }, [numericInterviewId]);

  // 5) WebSocket 연결 (쿠키 기반 인증)
  const { sendChat } = useInterviewSocket({
    interviewId: numericInterviewId,
    onChatMessage: (msg: OutgoingChatMessage) => {
      setMessages((prev) => {
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

  // 6) 질문 체크 토글 핸들러 ★ 수정한 부분
  const handleToggleQuestionCheck = async (questionId: number) => {
    try {
      await toggleQuestionCheck(numericInterviewId, questionId);

      // 서버는 checked 상태를 안 줌 → 프론트에서 바로 토글 처리
      setQuestionNotes((prev) =>
        prev.map((section) => ({
          ...section,
          questions: section.questions.map((q) =>
            q.id === questionId ? { ...q, checked: !q.checked } : q
          ),
        }))
      );
    } catch (error) {
      console.error('질문 체크 토글 실패:', error);
      throw error;
    }
  };

  // 7) 메시지 전송
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
          <QuestionNoteSection
            questionNotes={questionNotes}
            onToggleCheck={handleToggleQuestionCheck}
          />
          <InterviewSummarySection summaries={[]} currentUserId={me?.id} />
        </div>
      </div>
    </div>
  );
}
