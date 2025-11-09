// src/features/auth/pages/ResetPasswordEmailPage.tsx
import type { FormEvent } from 'react';
import AuthShell from '../components/AuthShell';

export default function ResetPasswordEmailPage() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    // 로그인처럼 글래스 카드 스타일을 공유하고, 좌측 로고는 숨김
    <AuthShell>
      {/* 상단 아이콘 + 제목 */}
      <div className="flex flex-col items-center text-center gap-6 mb-10">
        <img src="/icons/reset-password.svg" alt="비밀번호 아이콘" className="h-[48px] w-[48px]" />
        <h3 className="text-lg font-bold text-[#413F3F]">비밀번호 변경</h3>
      </div>

      {/* 폼 */}
      <form onSubmit={onSubmit} className="flex flex-col gap-10 mt-6">
        <div className="flex flex-col gap-4">
          <label className="block text-sm font-semibold text-jd-black">계정 이메일</label>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
            </div>

            <input
              placeholder="name@jobda.com"
              className="
                h-12 w-full rounded-full
                border border-jd-gray-light bg-jd-white
                pl-12 pr-5 text-[#413F3F]
                placeholder:text-jd-gray-dark/70
                outline-none
                shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
                focus:border-jd-gray-light focus:ring-0
              "
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <button
          type="submit"
          className="
            h-12 w-full rounded-full
            !text-white font-extrabold
            !bg-[#752F6D] [background-image:none] !opacity-100
            shadow-[0_4px_12px_rgba(117,47,109,.25)]
            hover:brightness-[1.05] active:brightness-95
            transition
          "
          style={{ height: 44, borderRadius: 15 }}
        >
          이메일 인증
        </button>
      </form>
    </AuthShell>
  );
}
