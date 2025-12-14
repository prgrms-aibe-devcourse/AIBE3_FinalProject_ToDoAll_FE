import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ResumeData } from '../types/resumes.types';
import checkImg from '../../../assets/Done.png';
import { checkMatch } from '../../match/api/matchApi';
import AlertModal from '../../../components/Alertmodal';

interface ApplicantStatusProps {
  data: ResumeData;
}

export default function ApplicantStatus({ data }: ApplicantStatusProps) {
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleInterviewInvite = async () => {
    try {
      await checkMatch(data.jdId, Number(data.id));
      navigate(`/interview/create?resumeId=${data.id}&jdId=${data.jdId}`);
    } catch (error) {
      console.error('매칭 확정 실패:', error);
      setShowErrorModal(true);
    }
  };

  return (
    <div className="flex w-96 items-center justify-between rounded-lg p-4">
      <div>
        <h3 className="text-[30px] font-semibold text-[#413F3F]">{data.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleInterviewInvite}
            style={{ borderColor: '#837C7C' }}
            className="flex items-center gap-2 rounded-lg border px-3 py-1 text-[#837C7C] hover:bg-[#E6F5E6] hover:text-[#1E4621]"
          >
            면접 초대
            <img src={checkImg} alt="done" className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AlertModal
        open={showErrorModal}
        type="error"
        title="오류 발생"
        message="이미 매칭된 지원자이거나 오류가 발생했습니다."
        onClose={() => setShowErrorModal(false)}
        confirmText="확인"
      />
    </div>
  );
}
