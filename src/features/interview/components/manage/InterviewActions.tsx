import React, { useState } from 'react';
import InterviewButton from './InterviewButton';
import InterviewResultModal from './InterviewResultModal';
import { type InterviewStatus } from '../../types/interviewer';
import { useNavigate } from 'react-router-dom';

interface InterviewActionsProps {
  status: InterviewStatus;
  name?: string;
  avatar?: string;
  interviewId?: number;
}

export default function InterviewActions({
  status,
  name,
  avatar,
  interviewId,
}: InterviewActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenInterviewNote = () => {
    navigate('/interview/note', {
      state: { name, avatar, interviewId },
    });
  };

  const handleCreateQuestionSet = () => {
    navigate(`/interview/${interviewId}/question-create`, {
      state: { name, avatar, interviewId },
    });
  };

  const handleStartInterview = () => {
    navigate('/interview/chat-room', {
      state: { avatar, interviewId },
    });
  };

  const actionButtons: Partial<Record<InterviewStatus, React.ReactNode[]>> = {
    WAITING: [
      <InterviewButton key="question" label="질문 세트 생성" onClick={handleCreateQuestionSet} />,
      <InterviewButton key="resume" label="이력서 열람" />,
    ],
    DONE: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
      <InterviewButton key="result" label="결과 등록" onClick={handleOpenModal} />,
    ],
    IN_PROGRESS: [
      <InterviewButton
        key="start"
        label="면접 시작"
        variant="primary"
        onClick={handleStartInterview}
      />,
    ],
    ACCEPTED: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
    ON_HOLD: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
    REJECTED: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
  };

  return (
    <>
      <div className="flex justify-center gap-4">{actionButtons[status]}</div>

      {/* DONE 상태에서만 결과 등록 */}
      {status === 'DONE' && isModalOpen && (
        <InterviewResultModal name={name} avatar={avatar} onClose={handleCloseModal} />
      )}
    </>
  );
}
