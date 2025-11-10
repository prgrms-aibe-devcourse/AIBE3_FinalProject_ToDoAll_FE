import React from 'react';
import InterviewButton from './InterviewButton';
import InterviewResultModal from './InterviewResultModal';
import { type InterviewStatus } from '../../types/interviewer';
import { useState } from 'react';
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

  // 면접 노트 페이지로 이동하는 함수
  const handleOpenInterviewNote = () => {
    navigate('/interview/manage/question-create', {
      state: {
        name,
        avatar,
        interviewId,
      },
    });
  };

  const actionButtons: Record<InterviewStatus, React.ReactNode[]> = {
    예정: [
      <InterviewButton key="question" label="질문 세트 생성" />,
      <InterviewButton key="resume" label="이력서 열람" />,
    ],
    미정: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />, //이동 이벤트 추가
      <InterviewButton key="result" label="결과 등록" onClick={handleOpenModal} />,
    ],
    진행중: [<InterviewButton key="start" label="면접 시작" variant="primary" />],
    합격: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
    보류: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
      <InterviewButton key="done" label="등록 완료" variant="success" />,
    ],
    불합격: [
      <InterviewButton key="note" label="면접 노트" onClick={handleOpenInterviewNote} />,
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
