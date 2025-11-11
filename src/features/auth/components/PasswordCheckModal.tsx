import React, { useState } from 'react';

interface PasswordCheckModalProps {
  onVerifySuccess: () => void;
  onClose: () => void;
}

export default function PasswordCheckModal({ onVerifySuccess, onClose }: PasswordCheckModalProps) {
  const [pw, setPw] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 실제 검증 API 호출
    if (pw.trim().length >= 4) {
      onVerifySuccess();
    } else {
      alert('비밀번호를 다시 확인해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50">
      <div className="relative mt-24 bg-[#F6EFEF] rounded-2xl p-8 w-[520px] shadow-[0_10px_24px_#00000030]">
        <div className="text-center mb-6">
          <img
            src="/logo/login-logo.png"
            alt="jobda"
            className="mx-auto w-16 h-20 object-contain"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호 확인"
            className="w-full rounded-full px-5 py-3 bg-white shadow-inner outline-none"
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-[var(--color-jd-gray-light)] text-[var(--color-jd-black)]"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-[var(--color-jd-yellow)] text-[var(--color-jd-black)]"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
