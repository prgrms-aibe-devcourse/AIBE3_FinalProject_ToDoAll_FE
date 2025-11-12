import { useState } from 'react';
import purplePlusImg from '../../../assets/Vector-3.png';
import type { ResumeData } from '../types/resumes.types';

type Props = {
  formData: ResumeData;
  onChange: (_field: keyof ResumeData, _value: ResumeData['files']) => void;
};

export default function FileUploadForm({ formData, onChange }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [newFile, setNewFile] = useState<{ name: string; file?: File }>({ name: '' });

  const addFile = () => {
    if (!newFile.file) {
      alert('파일을 선택해주세요.');
      return;
    }
    const currentEtc = formData.files.etc ?? [];
    const displayName = newFile.name?.trim() || newFile.file.name;
    const updatedFiles = {
      ...formData.files,
      etc: [...currentEtc, displayName],
    };
    onChange('files', updatedFiles);
    setShowForm(false);
    setNewFile({ name: '', file: undefined });
  };

  return (
    <>
      <div className="bg-[#FAF8F8] border-t border-b border-[#E0E0E0] p-2 flex items-center justify-between">
        <h2 className="text-lg font-semibold">포트폴리오 및 기타문서</h2>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          className="flex items-center gap-2 border rounded-[10px] px-4 py-2 text-[#752F6D] hover:bg-[#F3EAF7] transition"
          onClick={() => setShowForm(!showForm)}
        >
          <img src={purplePlusImg} alt="plus" className="w-4 h-4" />
          포트폴리오 및 기타문서 추가
        </button>
      </div>

      {showForm && (
        <div className="p-4 rounded-[10px] space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,.docx,.pptx,.zip,.jpg,.png"
              className="border p-2 rounded-[10px]"
              onChange={(e) => setNewFile({ ...newFile, file: e.target.files?.[0] })}
            />
            <button
              type="button"
              className="px-4 py-2 bg-[#E3DBDB] rounded-[8px] hover:bg-[#B1A0A0] transition"
              onClick={addFile}
            >
              추가
            </button>
          </div>
        </div>
      )}

      {((formData.files.etc && formData.files.etc.length > 0) || formData.files.portfolio) && (
        <div className="bg-white border border-[#E5E5E5] rounded-[10px] p-4 -mt-2">
          <div className="text-sm font-medium mb-2">첨부된 파일</div>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {formData.files.portfolio ? <li>{formData.files.portfolio}</li> : null}
            {formData.files.etc?.map((name, i) => (
              <li key={name + i}>{name}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
