import React, { useState } from 'react';
import InterviewButton from './InterviewButton';
import InterviewResultModal from './InterviewResultModal';
import { type InterviewStatus, type ResultStatus } from '../../types/interviewer';
import { useNavigate } from 'react-router-dom';

interface InterviewActionsProps {
  status: InterviewStatus;
  result: ResultStatus;
  name?: string;
  avatar?: string;
  interviewId?: number;
  resumeId?: number;
  date?: string;
  time?: string;
  interviewers?: string;
  position?: string;
}

export default function InterviewActions({
  status,
  result,
  name,
  avatar,
  interviewId,
  resumeId,
  date,
  time,
  interviewers,
  position,
}: InterviewActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenInterviewNote = () => {
    if (!interviewId) return;
    navigate(`/interview/${interviewId}/note`, {
      state: { name, avatar, interviewId },
    });
  };

  const handleUpdateQuestionSet = () => {
    navigate(`/interview/${interviewId}/question-create`, {
      state: { name, avatar, interviewId, date, time, interviewers, position, resumeId },
    });
  };

  const handleStartInterview = () => {
    navigate(`/interview/${interviewId}/chat-room`, {
      state: { avatar, interviewId },
    });
  };

  const handleOpenResume = () => {
    if (!resumeId) return;
    navigate(`/resumes/${resumeId}`);
  };

  /** 기본 상태별 버튼 */
  let buttons: React.ReactNode[] = [];

  if (status === 'WAITING') {
    buttons = [
      <InterviewButton
        key="question"
        label="질문 세트 보기"
        variant="question"
        onClick={handleUpdateQuestionSet}
      />,
      <InterviewButton key="resume" label="이력서 열람" onClick={handleOpenResume} />,
    ];
  }

  if (status === 'IN_PROGRESS') {
    buttons = [
      <InterviewButton
        key="start"
        label="면접 시작"
        variant="primary"
        onClick={handleStartInterview}
      />,
    ];
  }

  /** status === DONE → result에 따라 분기 */
  if (status === 'DONE') {
    if (result === 'PENDING' || result === 'HOLD') {
      // 아직 결과 미등록
      buttons = [
        <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
        <InterviewButton key="result" label="결과 등록" onClick={handleOpenModal} />,
      ];
    } else {
      // 결과 등록 완료
      buttons = [
        <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
        <InterviewButton key="done" label="등록 완료" variant="success" />,
      ];
    }
  }

  return (
    <>
      <div className="flex justify-center gap-4">{buttons}</div>

      {/* 결과 모달: PENDING → 등록 버튼 클릭 시 */}
      {status === 'DONE' && (result === 'PENDING' || result === 'HOLD') && isModalOpen && (
        <InterviewResultModal name={name} avatar={avatar} onClose={handleCloseModal} />
      )}
    </>
  );
}
