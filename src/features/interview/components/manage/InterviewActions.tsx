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
  onResultChange?: (_r: ResultStatus) => void;
}

export default function InterviewActions({
  status,
  result,
  name,
  avatar,
  interviewId,
  resumeId,
  onResultChange,
}: InterviewActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentResult, setCurrentResult] = useState(result); //추가!

  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenInterviewNote = () => {
    navigate('/interview/note', {
      state: { name, avatar, interviewId },
    });
  };

  const handleUpdateQuestionSet = () => {
    navigate(`/interview/${interviewId}/question-create`, {
      state: { name, avatar, interviewId },
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
    if (currentResult === 'PENDING' || currentResult === 'HOLD') {
      buttons = [
        <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
        <InterviewButton key="result" label="결과 등록" onClick={handleOpenModal} />,
      ];
    } else {
      buttons = [
        <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
        <InterviewButton key="done" label="등록 완료" variant="success" />,
      ];
    }
  }

  return (
    <>
      <div className="flex justify-center gap-4">{buttons}</div>

      {status === 'DONE' &&
        (currentResult === 'PENDING' || currentResult === 'HOLD') &&
        isModalOpen && (
          <InterviewResultModal
            name={name}
            avatar={avatar}
            interviewId={interviewId}
            onClose={handleCloseModal}
            onSuccess={(newResult) => {
              onResultChange?.(newResult); // UI 즉시 반영
              setCurrentResult(newResult); // 내부 상태도 업데이트
              setIsModalOpen(false);
            }}
          />
        )}
    </>
  );
}
