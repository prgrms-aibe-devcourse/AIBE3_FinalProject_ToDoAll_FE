// src/features/auth/pages/SignupFormPage.tsx
import type React from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AuthShell from '../components/AuthShell';

export default function SignupFormPage() {
  const [searchParams] = useSearchParams();

  // 개발용: 토큰 없으면 자동으로 'dev-token' 사용
  const token = searchParams.get('token') || 'dev-token';

  const [companyEmail, setCompanyEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 개발 중엔 서버 요청 대신 임시 이메일 세팅
    const fakeEmail = 'developer@jobda.com';
    setCompanyEmail(fakeEmail);
    setLoading(false);
  }, [token]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 회원가입 요청 (token과 함께 전송)
    console.log('회원가입 제출:', { companyEmail });
  };

  if (loading) {
    return (
      <AuthShell>
        <div className="text-center text-[#413F3F]">로딩 중...</div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/*  인증된 회사 이메일 (개발용 고정 표시) */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">회사 이메일 (인증됨)</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              {/* mail icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
              </svg>
            </div>
            <input
              value={companyEmail}
              readOnly
              className="h-12 w-full rounded-full border border-jd-gray-light bg-gray-100 pl-12 pr-5 text-[#413F3F]
              placeholder:text-jd-gray-dark/70 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0 cursor-not-allowed select-none"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#413F3F]/80">
            <span className="inline-flex items-center rounded-full bg-[#E3DBDB] px-2 py-0.5">
              인증 완료
            </span>
            <span>이메일은 변경할 수 없습니다.</span>
          </div>
        </div>

        {/* 기업명 */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">기업명</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="text-[#413F3F]"
              >
                <path
                  d="M4 22h16v-2h-1V4a1 1 0 0 0-1-1h-4V2h-4v1H6a1 1 0 0 0-1
                1v16H4v2zm3-2V5h10v15H7zM9 7h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-8h2v2h-2V7zm0
                4h2v2h-2v-2zm0 4h2v2h-2v-2z"
                />
              </svg>
            </div>
            <input
              placeholder="회사명을 입력하세요"
              className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
        </div>

        {/* 이름 + 직책 (2열) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 이름 */}
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-semibold text-jd-black">이름</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
                {/* user icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-3-3.87M4 21v-2a4 4 0 0 1 3-3.87m9-7.13a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" />
                </svg>
              </div>
              <input
                placeholder="이름을 입력하세요"
                autoComplete="off"
                name="signup-name"
                className="h-12 w-full rounded-full border border-jd-gray-light bg-jd-white pl-12 pr-5 text-[#413F3F]
        placeholder:text-jd-gray-dark/70 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
        focus:border-jd-gray-light focus:ring-0"
                style={{ borderRadius: 15, paddingLeft: '3rem' }}
              />
            </div>
          </div>

          {/* 직책 */}
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-semibold text-jd-black">직책</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
                {/* briefcase icon (18x18, currentColor) */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 64 64"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M26 6c-2.18 0-4 1.82-4 4v2H5v17c0 2.21 1.79 4 4 4h19v-4h8v4h19c2.21 0 4-1.79 4-4V12H42v-2c0-2.18-1.82-4-4-4H26zm0 4h12v2H26v-2zm4 21v6h4v-6h-4zM5 35v15c0 2.21 1.79 4 4 4h46c2.21 0 4-1.79 4-4V36l-23-.43V39h-8v-3.57L5 35z" />
                </svg>
              </div>
              <input
                placeholder="예: 매니저"
                name="signup-title"
                className="h-12 w-full rounded-full border border-jd-gray-light bg-jd-white pl-12 pr-5 text-[#413F3F]
        placeholder:text-jd-gray-dark/70 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
        focus:border-jd-gray-light focus:ring-0"
                style={{ borderRadius: 15, paddingLeft: '3rem' }}
              />
            </div>
          </div>
        </div>

        {/* 비밀번호 */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">비밀번호</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2
                2 0 0 0-2-2Zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm3.1-9H8.9V6a3.1 3.1 0 1 1 6.2 0v2Z"
                />
              </svg>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
        </div>

        {/* 비밀번호 확인 */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">비밀번호 확인</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#413F3F]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2
                2 0 0 0-2-2Zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4Zm3.1-9H8.9V6a3.1 3.1 0 1 1 6.2 0v2Z"
                />
              </svg>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="
              inline-flex items-center justify-center
              h-12 w-40 select-none
              !rounded-[15px] !bg-[#752F6D] !text-white
              font-extrabold tracking-tight
              [background-image:none] !opacity-100
              shadow-[0_4px_12px_rgba(117,47,109,.25)]
              hover:brightness-[1.05] active:brightness-95
              transition will-change-transform
              outline-none ring-0 focus-visible:ring-2 focus-visible:ring-[#752F6D]/40
            "
            style={{ appearance: 'none', WebkitAppearance: 'none' }}
          >
            회원가입
          </button>
        </div>
      </form>
    </AuthShell>
  );
}
