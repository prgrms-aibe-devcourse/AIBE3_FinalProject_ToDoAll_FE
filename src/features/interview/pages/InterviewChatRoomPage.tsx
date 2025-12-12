// src/pages/InterviewChatRoomPage.tsx
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';

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
import { DEFAULT_AVATAR, normalizeAvatarUrl, toNumId } from '../util/avatar';
import { getInterviewDetailAuthed } from '@/features/interview/api/interview-detail.api';
import { getPresignedDownloadUrlAuthed } from '@/features/interview/api/file.api';

type UiMsg = { id: number; text: string; senderId: number; isMine: boolean };

export default function InterviewChatRoomPage() {
  const { interviewId: interviewIdParam } = useParams();
  const navigate = useNavigate();
  const interviewId = Number(interviewIdParam);

  const [me, setMe] = useState<Me | null>(null);
  const [messages, setMessages] = useState<UiMsg[]>([]);
  const [questionNotes, setQuestionNotes] = useState<QuestionSection[]>([]);
  const [summaries, setSummaries] = useState<InterviewSummary[]>([]);

  const [avatarBySender, setAvatarBySender] = useState<Record<number, string>>({});
  const loadingAvatarRef = useRef<Set<number>>(new Set());

  const [candidateAvatar, setCandidateAvatar] = useState<string>(DEFAULT_AVATAR);
  const [resumeId, setResumeId] = useState<number | null>(null);

  // me 로딩
  useEffect(() => {
    (async () => {
      try {
        const user = await getMeAuthed();
        console.log('[ME LOADED]', user);
        setMe(user);
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
      }
    })();
  }, []);

  // 인터뷰 상세로 resumeId / candidateAvatar 확보
  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;

    (async () => {
      try {
        const detail = await getInterviewDetailAuthed(interviewId);
        console.log('[DETAIL]', detail);

        setResumeId(detail.resumeId ?? null);

        setCandidateAvatar(
          detail.candidateAvatar
            ? (normalizeAvatarUrl(detail.candidateAvatar) ?? DEFAULT_AVATAR)
            : DEFAULT_AVATAR
        );
      } catch (e) {
        console.error('인터뷰 상세 조회 실패:', e);
      }
    })();
  }, [interviewId]);

  // 채팅 내역 불러오기 (senderId 숫자 정규화)
  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;

    (async () => {
      try {
        const history = await getChatHistory(interviewId);
        console.log('[HISTORY RAW]', history);

        const mapped: UiMsg[] = history.map((m: ChatMessage) => ({
          id: m.id,
          text: m.content,
          senderId: toNumId(m.senderId),
          isMine: false, // me 로딩 후 보정
        }));
        setMessages(mapped);
      } catch (e) {
        console.error('채팅 내역 불러오기 실패:', e);
      }
    })();
  }, [interviewId]);

  // me 로딩 후 isMine 보정 (Number 비교)
  useEffect(() => {
    if (!me) return;
    setMessages((prev) =>
      prev.map((m) => ({
        ...m,
        isMine: toNumId(m.senderId) === toNumId(me.id),
      }))
    );
  }, [me]);

  /**
   * ✅ 지원자(senderId=0) 아바타 전용 로딩
   * - 기존 문제: 처음엔 resumeId가 null이라 0번을 DEFAULT로 박고, resumeId가 나중에 와도 다시 fetch를 안 함
   * - 해결: resumeId / candidateAvatar 변경에 반응해서 0번을 항상 최신으로 재계산
   */
  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;

    (async () => {
      try {
        // 1) candidateAvatar가 있으면 우선 사용 (단, DEFAULT면 의미 없으니 제외)
        if (candidateAvatar && candidateAvatar !== DEFAULT_AVATAR) {
          console.log('[CANDIDATE AVATAR] use candidateAvatar', candidateAvatar);
          setAvatarBySender((prev) => ({ ...prev, 0: candidateAvatar }));
          return;
        }

        // 2) resumeId 없으면 default
        if (!resumeId) {
          console.log('[CANDIDATE AVATAR] no resumeId -> default');
          setAvatarBySender((prev) => ({ ...prev, 0: DEFAULT_AVATAR }));
          return;
        }

        // 3) resumeFileUrl(fileKey) -> presigned
        const resume = await getResumeAuthed(resumeId);
        const fileKey = resume.resumeFileUrl;
        console.log('[CANDIDATE AVATAR] resumeFileUrl', fileKey);

        if (!fileKey) {
          console.log('[CANDIDATE AVATAR] no fileKey -> default');
          setAvatarBySender((prev) => ({ ...prev, 0: DEFAULT_AVATAR }));
          return;
        }

        const presigned = await getPresignedDownloadUrlAuthed(fileKey);
        console.log('[CANDIDATE AVATAR] presigned OK', presigned);

        setAvatarBySender((prev) => ({ ...prev, 0: presigned }));
      } catch (e) {
        console.error('[CANDIDATE AVATAR] FAIL', e);
        setAvatarBySender((prev) => ({ ...prev, 0: DEFAULT_AVATAR }));
      }
    })();
  }, [interviewId, resumeId, candidateAvatar]);

  /**
   * ✅ 면접관(senderId>0) 아바타 로딩 (0번 제외)
   * - messages에 등장한 유저 중 avatarBySender에 없는 것만 로딩
   */
  useEffect(() => {
    if (messages.length === 0) return;

    const senderIds = Array.from(new Set(messages.map((m) => toNumId(m.senderId))));
    const interviewerIds = senderIds.filter((id) => id > 0);

    const missing = interviewerIds.filter(
      (id) => !avatarBySender[id] && !loadingAvatarRef.current.has(id)
    );

    if (missing.length === 0) return;

    console.log('[AVATAR EFFECT] interviewerIds', interviewerIds, 'missing', missing);
    missing.forEach((id) => loadingAvatarRef.current.add(id));

    (async () => {
      const updates: Record<number, string> = {};

      try {
        await Promise.all(
          missing.map(async (senderId) => {
            try {
              const user = await getUserProfileAuthed(senderId);
              console.log('[AVATAR] user raw', user);

              updates[senderId] = normalizeAvatarUrl(user.profileUrl) ?? DEFAULT_AVATAR;
            } catch (e) {
              console.warn('[AVATAR] user fetch fail senderId=', senderId, e);
              updates[senderId] = DEFAULT_AVATAR;
            }
          })
        );
      } finally {
        missing.forEach((id) => loadingAvatarRef.current.delete(id));
      }

      console.log('[AVATAR] updates', updates);
      setAvatarBySender((prev) => ({ ...prev, ...updates }));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]); // avatarBySender는 의도적으로 deps 제외 (무한루프 방지)

  // 질문 불러오기
  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;

    (async () => {
      try {
        const questions = await getInterviewQuestions(interviewId);
        const map = new Map<string, InterviewQuestion[]>();

        console.log('[QUESTIONS]', questions);

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
  }, [interviewId]);

  // 메모 불러오기
  useEffect(() => {
    if (!Number.isFinite(interviewId) || interviewId <= 0) return;

    (async () => {
      try {
        const memos = await getInterviewMemos(interviewId);

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
            if (typeof parsed === 'object' && (parsed as any).content) {
              let finalContent: any = (parsed as any).content;
              while (typeof finalContent === 'string' && finalContent.startsWith('{')) {
                try {
                  const nested = JSON.parse(finalContent);
                  if ((nested as any).content) finalContent = (nested as any).content;
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
  }, [interviewId]);

  // WS 메시지 수신 (senderId 정규화)
  const handleChatMessage = useCallback(
    (msg: any) => {
      const senderId = toNumId(msg.senderId ?? msg.sender_id ?? msg.userId ?? msg.user_id);
      const content = String(msg.content ?? '').trim();
      if (!content) return;

      setMessages((prev) => {
        const now = Date.now();
        const isDuplicate = prev.some(
          (m) => m.text === content && m.senderId === senderId && Math.abs(m.id - now) < 2500
        );
        if (isDuplicate) return prev;

        return [
          ...prev,
          {
            id: now,
            text: content,
            senderId,
            isMine: me ? senderId === toNumId(me.id) : false,
          },
        ];
      });
    },
    [me]
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
    interviewId,
    onChatMessage: handleChatMessage,
    onNoteMessage: handleNoteMessage,
  });

  const handleToggleQuestionCheck = async (questionId: number) => {
    await toggleQuestionCheck(interviewId, questionId);
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
    const trimmed = content.trim();
    if (!trimmed) return;

    const tempId = Date.now();
    setMessages((prev) => [
      ...prev,
      { id: tempId, text: trimmed, senderId: toNumId(me.id), isMine: true },
    ]);

    const payload: OutgoingChatMessage = {
      type: MessageType.CHAT,
      interviewId,
      senderId: toNumId(me.id),
      sender: me.name ?? me.nickname ?? '사용자',
      content: trimmed,
    };

    sendChat(payload);
  };

  const handleSendNote = (content: string) => {
    if (!me) return;
    sendNote(content);
  };

  const handleUpdateMemo = async (memoId: number, content: string) => {
    const data = await updateInterviewMemo(interviewId, memoId, content);
    setSummaries((prev) =>
      prev.map((s) => (s.id === data.memoId ? { ...s, content: data.content } : s))
    );
  };

  const handleEndInterview = async () => {
    try {
      await endInterview(interviewId);
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
          <ChatSection
            initialMessages={messages}
            getAvatarForSender={(senderId) => avatarBySender[toNumId(senderId)]}
            onSend={handleSend}
          />
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
