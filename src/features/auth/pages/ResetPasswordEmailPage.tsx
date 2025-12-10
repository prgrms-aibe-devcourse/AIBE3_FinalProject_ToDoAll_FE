import { type FormEvent, useState } from 'react';

import { requestResetEmail } from '../api/auth.api.ts';
import AuthShell from '../components/AuthShell.tsx';
import AlertModal from '@components/Alertmodal.tsx';

export default function ResetPasswordEmailPage() {
  const [alertModal, setAlertModal] = useState({
    open: false,
    type: 'info' as 'success' | 'error' | 'info' | 'warning',
    message: '',
  });

  const showAlert = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setAlertModal({ open: true, type, message });
  };

  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, open: false }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = new FormData(e.target as HTMLFormElement);
    const email = String(form.get('email') || '');
    try {
      await requestResetEmail(email); // 서버에 메일 발송 요청
      showAlert('이메일을 확인해 주세요.\n비밀번호 재설정 링크가 발송되었습니다.', 'success');
    } catch {
      showAlert('이메일 전송에 실패했습니다.\n다시 시도해주세요.', 'error');
    }
  };

  return (
    // 로그인처럼 글래스 카드 스타일을 공유하고, 좌측 로고는 숨김
    <AuthShell>
      {/* 상단 아이콘 + 제목 */}
      <div className="mb-10 flex flex-col items-center gap-6 text-center">
        <img src="/icons/reset-password.svg" alt="비밀번호 아이콘" className="h-[48px] w-[48px]" />
        <h3 className="text-lg font-bold text-[#413F3F]">비밀번호 변경</h3>
      </div>

      {/* 폼 */}
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <label className="text-m text-jd-black block font-semibold">계정 이메일</label>

          <div className="relative">
            <div className="absolute top-1/2 left-4 -translate-y-1/2 text-[#413F3F]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
            </div>

            <input
              placeholder="name@jobda.com"
              type="email"
              name="email"
              className="border-jd-gray-light bg-jd-white placeholder:text-jd-gray-dark/70 focus:border-jd-gray-light h-12 w-full rounded-full border pr-5 pl-12 text-[#413F3F] shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)] outline-none focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="h-12 w-full rounded-full !bg-[#752F6D] [background-image:none] font-extrabold !text-white !opacity-100 shadow-[0_4px_12px_rgba(117,47,109,.25)] transition hover:brightness-[1.05] active:brightness-95"
          style={{ height: 44, borderRadius: 15 }}
        >
          이메일 인증
        </button>
      </form>
      <AlertModal
        open={alertModal.open}
        type={alertModal.type}
        message={alertModal.message}
        onClose={closeAlert}
      />
    </AuthShell>
  );
}
