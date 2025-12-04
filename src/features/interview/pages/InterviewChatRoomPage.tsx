import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatSection from '../components/chat/ChatSection';
import QuestionNoteSection from '../components/chat/QuestionNoteSection';
import InterviewSummarySection from '../components/chat/InterviewSummarySection';

import { useEffect, useState } from 'react';

import { getMeAuthed } from '@/features/interview/api/me.authed.api';

import {
  getInterviewQuestions,
  toggleQuestionCheck,
  getChatHistory,
  getInterviewMemos,
  updateInterviewMemo, // ✅ 추가
  type InterviewQuestion,
  type ChatMessage,
  type InterviewMemo,
} from '@/features/interview/api/question.api';

import useInterviewSocket from '@/hooks/useInterviewSocket';

import {
  MessageType,
  type OutgoingChatMessage,
  type QuestionSection,
  type InterviewSummary,
  type IncomingNoteMessage,
} from '../types/chatroom';

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
  const [summaries, setSummaries] = useState<InterviewSummary[]>([]);

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
        const user = await getMeAuthed();
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
          isMine: false,
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
              id: q.questionId,
              content: q.content,
              checked: q.checked ?? false,
            })),
          }))
        );
      } catch (e) {
        console.error('질문 불러오기 실패:', e);
      }
    })();
  }, [numericInterviewId]);

  // 5) 메모 로드 (같은 userId의 최신 메모만)
  useEffect(() => {
    if (!numericInterviewId) return;

    (async () => {
      try {
        const memos = await getInterviewMemos(numericInterviewId);

        const memoMap = new Map<number, InterviewMemo>();
        memos.forEach((memo: InterviewMemo) => {
          const userId = memo.author.userId;
          const existing = memoMap.get(userId);
          if (!existing || new Date(memo.updatedAt) > new Date(existing.updatedAt)) {
            memoMap.set(userId, memo);
          }
        });

        const summaryList: InterviewSummary[] = Array.from(memoMap.values()).map((memo) => {
          let content = memo.content;
          try {
            const parsed = JSON.parse(memo.content);
            if (typeof parsed === 'object' && parsed.content) {
              let finalContent = parsed.content;
              while (typeof finalContent === 'string' && finalContent.startsWith('{')) {
                try {
                  const nested = JSON.parse(finalContent);
                  if (nested.content) finalContent = nested.content;
                  else break;
                } catch {
                  break;
                }
              }
              content = typeof finalContent === 'string' ? finalContent : memo.content;
            }
          } catch {
            // JSON 파싱 실패 시 원본 content 사용
          }

          return {
            id: memo.memoId,
            authorId: memo.author.userId,
            title: memo.author.name,
            content,
          };
        });

        setSummaries(summaryList);
      } catch (e) {
        console.error('메모 불러오기 실패:', e);
      }
    })();
  }, [numericInterviewId]);

  // 6) WebSocket 연결
  const { sendChat, sendNote } = useInterviewSocket({
    interviewId: numericInterviewId,
    onChatMessage: (msg: OutgoingChatMessage) => {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) =>
            m.text === msg.content &&
            m.senderId === msg.senderId &&
            Math.abs(m.id - Date.now()) < 5000
        );
        if (isDuplicate) return prev;

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
    onNoteMessage: (msg: IncomingNoteMessage) => {
      // NOTE 생성/수신은 실시간으로 요약 갱신
      setSummaries((prev) => {
        const filtered = prev.filter((s) => s.authorId !== msg.senderId);
        return [
          ...filtered,
          {
            id: msg.noteId ?? Date.now(),
            authorId: msg.senderId,
            title: msg.sender,
            content: msg.content,
          },
        ];
      });
    },
  });

  // 7) 질문 체크 토글 핸들러
  const handleToggleQuestionCheck = async (questionId: number) => {
    try {
      await toggleQuestionCheck(numericInterviewId, questionId);

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

  // 8) 메시지 전송
  const handleSend = (content: string) => {
    if (!me) {
      console.warn('⚠️ 사용자 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    const tempId = Date.now();
    const newMessage = { id: tempId, text: content, senderId: me.id, isMine: true };
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

  // 9) 노트 전송 핸들러 (생성: WS)
  const handleSendNote = (content: string) => {
    if (!me) {
      console.warn('⚠️ 사용자 정보가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    console.log('📝 노트 전송:', content);
    sendNote(content);
  };

  // ✅ 10) 메모 수정 저장(HTTP PATCH)
  const handleUpdateMemo = async (memoId: number, content: string) => {
    // content를 그대로 서버에 보냄. (서버가 title/content 분리를 원하면 여기서 JSON으로 감싸도 됨)
    const data = await updateInterviewMemo(numericInterviewId, memoId, content);
    // data: { memoId, content, updatedAt }

    setSummaries((prev) =>
      prev.map((s) => (s.id === data.memoId ? { ...s, content: data.content } : s))
    );
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
          <InterviewSummarySection
            summaries={summaries}
            currentUserId={me?.id}
            onSendNote={handleSendNote}
            onUpdateMemo={handleUpdateMemo} // ✅ 연결
          />
        </div>
      </div>
    </div>
  );
}
