import React from 'react';
const Footer = () => {
  return (
    <>
      <footer
        className="
        bg-[#F6EFEF]
        text-[#413F3F]
        ring-1 ring-[#E3DBDB]
        shadow-[0_6px_22px_rgba(0,0,0,.1)]
        font-[var(--default-font-family)]
        "
      >
        <div className="mx-auto max-w-6xl px-6 py-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* 로고 / 좌측 */}
          <div className=" flex items-center justify-start h-full gap-4">
            <img src="/logo/login-logo.png" alt="jobda" className="h-16 w-auto " />
          </div>

          {/* 링크 / 우측 */}
          <div className="flex md:justify-end">
            <ul className="text-base leading-8">
              <li className="font-bold mb-2 text-[var(--color-jd-violet)] ">Jobda</li>
              <li>
                <a className="text-sm text-[var(--color-jd-violet)] transition" href="/dashboard">
                  대시보드
                </a>
              </li>
              <li>
                <a className="text-sm text-[var(--color-jd-violet)] transition" href="/jobs">
                  공고 관리
                </a>
              </li>
              <li>
                <a className="text-sm text-[var(--color-jd-violet)] transition" href="/resumes">
                  지원자 조회
                </a>
              </li>
              <li>
                <a
                  className="text-sm text-[var(--color-jd-violet)] transition"
                  href="/interview/manage"
                >
                  면접 관리
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 저작권 영역 */}
        <div className="border-t border-[#E3DBDB]">
          <div className="text-sm text-[var(--color-jd-violet)] font-semibold mx-auto max-w-6xl px-6 py-5 text-right">
            © 2025 <span className="!font-bold">Jobda Inc.</span> All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
