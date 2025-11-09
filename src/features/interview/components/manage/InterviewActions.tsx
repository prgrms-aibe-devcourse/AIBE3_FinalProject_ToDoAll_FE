import React from 'react';
import InterviewButton from './InterviewButton';
import InterviewResultModal from './InterviewResultModal';
import { type InterviewStatus } from '../../types/interviewer';
import { useState } from 'react';

interface InterviewActionsProps {
  status: InterviewStatus;
  name?: string;
  avatar?: string;
}

export default function InterviewActions({ status, name, avatar }: InterviewActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const actionButtons: Record<InterviewStatus, React.ReactNode[]> = {
    예정: [
      <InterviewButton key="question" label="질문 세트 생성" />,
      <InterviewButton key="resume" label="이력서 열람" />,
    ],
    미정: [
      <InterviewButton key="note" label="면접 노트" />,
      <InterviewButton key="result" label="결과 등록" onClick={handleOpenModal} />,
    ],
    진행중: [<InterviewButton key="start" label="면접 시작" variant="primary" />],
    합격: [
      <InterviewButton key="note" label="면접 노트" />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
    보류: [
      <InterviewButton key="note" label="면접 노트" />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
    불합격: [
      <InterviewButton key="note" label="면접 노트" />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
  };

  return (
    <>
      <div className="flex justify-center gap-4">{actionButtons[status]}</div>
      {status === '미정' && isModalOpen && (
        <InterviewResultModal name={name} avatar={avatar} onClose={handleCloseModal} />
      )}
    </>
  );
}
