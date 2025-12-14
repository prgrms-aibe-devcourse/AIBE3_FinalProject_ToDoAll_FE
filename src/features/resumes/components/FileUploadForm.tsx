import { useState } from 'react';
import purplePlusImg from '../../../assets/Vector-3.png';
import type { ResumeData } from '../types/resumes.types';
import AlertModal from '../../../components/Alertmodal';

type Props = {
  formData: ResumeData;
  onChange: <K extends keyof ResumeData>(_field: K, _value: ResumeData[K]) => void;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function FileUploadForm({ formData, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newFile, setNewFile] = useState<{ name: string; file?: File }>({ name: '' });
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string>('');
  const [showFileWarning, setShowFileWarning] = useState(false);

  const checkFileSize = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileSizeError(`${fileSizeMB}MB`);
      setShowSizeWarning(true);
      return false;
    }
    return true;
  };

  const addPortfolioFile = () => {
    console.log('[addPortfolioFile] newFile:', newFile);

    if (!newFile.file) {
      setShowFileWarning(true);
      return;
    }

    // 파일 크기 체크
    if (!checkFileSize(newFile.file)) {
      return;
    }

    const displayName = newFile.name?.trim() || newFile.file.name;

    console.log('[addPortfolioFile] 업로드되는 file:', newFile.file);

    onChange('files', {
      ...formData.files,
      portfolio: newFile.file,
      portfolioName: displayName,
      portfolioKey: '',
    });

    console.log('[addPortfolioFile] onChange 호출됨');

    setShowForm(false);
    setNewFile({ name: '', file: undefined });
  };

  return (
    <>
      <div className="flex items-center justify-between border-t border-b border-[#E0E0E0] bg-[#FAF8F8] p-2">
        <h2 className="text-lg font-semibold">포트폴리오 및 기타문서</h2>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="flex items-center gap-2 rounded-[10px] border px-4 py-2 text-[#752F6D] transition hover:bg-[#F3EAF7]"
          onClick={() => setShowForm(!showForm)}
        >
          <img src={purplePlusImg} alt="plus" className="h-4 w-4" />
          포트폴리오 추가
        </button>
      </div>

      {showForm && (
        <div className="space-y-3 rounded-[10px] p-4">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.jpg,.jpeg,.png"
              className="rounded-[10px] border p-2"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // 파일 선택 시 바로 크기 체크
                  if (checkFileSize(file)) {
                    setNewFile({ ...newFile, file });
                  } else {
                    // 파일 크기 초과 시 input 초기화
                    e.target.value = '';
                  }
                } else {
                  setNewFile({ ...newFile, file: undefined });
                }
              }}
            />
            <button
              type="button"
              className="rounded-[8px] bg-[#E3DBDB] px-4 py-2 transition hover:bg-[#B1A0A0]"
              onClick={addPortfolioFile}
            >
              추가
            </button>
          </div>
        </div>
      )}

      {(formData.files.portfolioName || formData.files.portfolioKey) && (
        <div className="relative -mt-2 rounded-[10px] border border-[#E5E5E5] bg-white p-4">
          <div className="mb-2 text-sm font-medium">첨부된 파일</div>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>{formData.files.portfolioName || formData.files.portfolioKey}</li>
          </ul>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange('files', {
                ...formData.files,
                portfolio: null,
                portfolioName: '',
                portfolioKey: '',
              });
            }}
            className="absolute top-1 right-1 rounded-full p-1 transition hover:text-[#DE4F36]"
            aria-label="파일 삭제"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <AlertModal
        open={showSizeWarning}
        type="warning"
        title="파일 크기 초과"
        message={`파일 크기가 5MB를 초과합니다.\n\n선택한 파일 크기: ${fileSizeError}\n최대 허용 크기: 5MB\n\n5MB 이하의 파일을 선택해주세요.`}
        onClose={() => {
          setShowSizeWarning(false);
          setFileSizeError('');
        }}
        confirmText="확인"
      />

      <AlertModal
        open={showFileWarning}
        type="warning"
        title="파일 선택 필요"
        message="파일을 선택해주세요."
        onClose={() => setShowFileWarning(false)}
        confirmText="확인"
      />
    </>
  );
}
