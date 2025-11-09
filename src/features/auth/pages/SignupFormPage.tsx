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
          <input
            placeholder="회사명을 입력하세요"
            className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
            style={{ borderRadius: 15, paddingLeft: '3rem' }}
          />
        </div>

        {/* 이름 */}
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">이름</label>
          <input
            placeholder="이름을 입력하세요"
            autoComplete="new-password"
            name="signup-name"
            className="h-12 w-full rounded-full border border-jd-gray-light bg-jd-white px-5 text-[#413F3F]
            placeholder:text-jd-gray-dark/70 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
            focus:border-jd-gray-light focus:ring-0"
            style={{ borderRadius: 15, paddingLeft: '3rem' }}
          />
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
              h-12 w-56 select-none
              !rounded-full !bg-[#752F6D] !text-white
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
