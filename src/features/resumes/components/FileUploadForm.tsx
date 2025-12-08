import { useState } from 'react';
import purplePlusImg from '../../../assets/Vector-3.png';
import type { ResumeData } from '../types/resumes.types';

type Props = {
  formData: ResumeData;
  onChange: (_field: keyof ResumeData, _value: any) => void;
};

export default function FileUploadForm({ formData, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newFile, setNewFile] = useState<{ name: string; file?: File }>({ name: '' });

  const addPortfolioFile = () => {
    if (!newFile.file) {
      alert('파일을 선택해주세요.');
      return;
    }

    const displayName = newFile.name?.trim() || newFile.file.name;

    // ✅ 포트폴리오 "1개만" 저장(덮어쓰기)
    onChange('files', {
      ...formData.files,
      portfolio: newFile.file, // ✅ 실제 업로드용 File
      portfolioName: displayName, // ✅ 화면 표시용
      portfolioKey: '', // ✅ 생성 전이니 비움
    });

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
              onChange={(e) => setNewFile({ ...newFile, file: e.target.files?.[0] })}
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
        <div className="-mt-2 rounded-[10px] border border-[#E5E5E5] bg-white p-4">
          <div className="mb-2 text-sm font-medium">첨부된 파일</div>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>{formData.files.portfolioName || formData.files.portfolioKey}</li>
          </ul>
        </div>
      )}
    </>
  );
}
