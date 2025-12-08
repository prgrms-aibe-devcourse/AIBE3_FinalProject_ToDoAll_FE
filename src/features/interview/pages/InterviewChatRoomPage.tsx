import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import ChatSection from '../components/chat/ChatSection';
import QuestionNoteSection from '../components/chat/QuestionNoteSection';
import InterviewSummarySection from '../components/chat/InterviewSummarySection';

import { endInterview } from '@/features/interview/api/interview.api';
import { getMeAuthed, type Me } from '@/features/interview/api/me.authed.api';

import {
  getInterviewQuestions,
  toggleQuestionCheck,
  getChatHistory,
  getInterviewMemos,
  updateInterviewMemo,
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

import { getResumeAuthed, getUserProfileAuthed } from '@/features/interview/api/profile.api';
import { DEFAULT_AVATAR, normalizeAvatarUrl } from '../util/avatar';

type UiMsg = { id: number; text: string; senderId: number; isMine: boolean };

export default function InterviewChatRoomPage() {
  const location = useLocation();
  const { interviewId: interviewIdParam } = useParams();
  const navigate = useNavigate();

  const numericInterviewId = Number(interviewIdParam);

  const [me, setMe] = useState<Me | null>(null);
  const [messages, setMessages] = useState<UiMsg[]>([]);
  const [peerAvatar, setPeerAvatar] = useState<string>(DEFAULT_AVATAR);

  const [questionNotes, setQuestionNotes] = useState<QuestionSection[]>([]);
  const [summaries, setSummaries] = useState<InterviewSummary[]>([]);

  // 익명일 때 필요: 라우팅 state로 resumeId를 받는다고 가정
  const resumeIdFromState = (location.state as any)?.resumeId as number | undefined;

  // 중복 아바타 호출 방지
  const lastPeerKeyRef = useRef<string>('');

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

  // 채팅 내역 불러오기
  useEffect(() => {
    if (!numericInterviewId) {
      console.error('잘못된 interviewId:', interviewIdParam);
      return;
    }

    (async () => {
      try {
        const history = await getChatHistory(numericInterviewId);

        const mapped: UiMsg[] = history.map((m: ChatMessage) => ({
          id: m.id,
          text: m.content,
          senderId: m.senderId,
          isMine: false, // me 로딩 후 보정
        }));

        setMessages(mapped);
      } catch (e) {
        console.error('채팅 내역 불러오기 실패:', e);
      }
    })();
  }, [numericInterviewId, interviewIdParam]);

  // me 로딩 후 isMine 보정
  useEffect(() => {
    if (!me) return;
    setMessages((prev) => prev.map((m) => ({ ...m, isMine: m.senderId === me.id })));
  }, [me]);

  // 상대 senderId (내 메시지 제외해서 1명만)
  const peerSenderId = useMemo(() => {
    if (!messages.length) return undefined;
    const peer = messages.find((m) => !m.isMine);
    return peer?.senderId;
  }, [messages]);

  // 상대 아바타 로딩
  useEffect(() => {
    if (peerSenderId === undefined) {
      return;
    }

    const key = `peerSenderId:${peerSenderId}|resumeId:${resumeIdFromState ?? 'none'}`;
    if (lastPeerKeyRef.current === key) {
      return;
    }
    lastPeerKeyRef.current = key;

    let cancelled = false;
    (async () => {
      try {
        // 로그인 유저로 판단
        if (peerSenderId > 0) {
          const user = await getUserProfileAuthed(peerSenderId);
          if (cancelled) return;

          const avatarUrl = normalizeAvatarUrl(user.profileUrl);
          setPeerAvatar(avatarUrl);
          return;
        }

        // 익명(게스트)로 판단
        if (resumeIdFromState) {
          const resume = await getResumeAuthed(resumeIdFromState);
          if (cancelled) return;

          const avatarUrl = normalizeAvatarUrl(resume.resumeFileUrl);
          setPeerAvatar(avatarUrl);
          return;
        }

        // 정보가 없으면 기본
        if (cancelled) return;
        setPeerAvatar(DEFAULT_AVATAR);
      } catch (e) {
        if (cancelled) return;
        console.error('[프로필] 상대방 아바타 로딩 실패:', e);
        setPeerAvatar(DEFAULT_AVATAR);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [peerSenderId, resumeIdFromState]);

  // 질문 불러오기
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

  // 메모 불러오기
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

          // memo.content 가 중첩 JSON 문자열일 수 있는 케이스 처리(너 코드 유지)
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
            // ignore
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

  const handleChatMessage = useCallback(
    (msg: OutgoingChatMessage) => {
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
    [me?.id]
  );

  const handleNoteMessage = useCallback((msg: IncomingNoteMessage) => {
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
  }, []);

  const { sendChat, sendNote } = useInterviewSocket({
    interviewId: numericInterviewId,
    onChatMessage: handleChatMessage,
    onNoteMessage: handleNoteMessage,
  });

  const handleToggleQuestionCheck = async (questionId: number) => {
    await toggleQuestionCheck(numericInterviewId, questionId);
    setQuestionNotes((prev) =>
      prev.map((section) => ({
        ...section,
        questions: section.questions.map((q) =>
          q.id === questionId ? { ...q, checked: !q.checked } : q
        ),
      }))
    );
  };

  const handleSend = (content: string) => {
    if (!me) return;

    const tempId = Date.now();
    setMessages((prev) => [...prev, { id: tempId, text: content, senderId: me.id, isMine: true }]);

    const payload: OutgoingChatMessage = {
      type: MessageType.CHAT,
      interviewId: numericInterviewId,
      senderId: me.id,
      sender: me.name ?? me.nickname ?? '사용자',
      content,
    };

    sendChat(payload);
  };

  const handleSendNote = (content: string) => {
    if (!me) return;
    sendNote(content);
  };

  const handleUpdateMemo = async (memoId: number, content: string) => {
    const data = await updateInterviewMemo(numericInterviewId, memoId, content);
    setSummaries((prev) =>
      prev.map((s) => (s.id === data.memoId ? { ...s, content: data.content } : s))
    );
  };

  const handleEndInterview = async () => {
    try {
      await endInterview(numericInterviewId);
      navigate('/interview/manage');
    } catch (e) {
      console.error('면접 종료 실패:', e);
    }
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
          <ChatSection initialMessages={messages} avatar={peerAvatar} onSend={handleSend} />
          <QuestionNoteSection
            questionNotes={questionNotes}
            onToggleCheck={handleToggleQuestionCheck}
          />
          <InterviewSummarySection
            summaries={summaries}
            currentUserId={me?.id}
            onSendNote={handleSendNote}
            onUpdateMemo={handleUpdateMemo}
          />
        </div>
      </div>
    </div>
  );
}
