const Footer = () => {
  return (
    <>
      <footer className="bg-[#F6EFEF] font-[var(--default-font-family)] text-[#413F3F] shadow-[0_6px_22px_rgba(0,0,0,.1)] ring-1 ring-[#E3DBDB]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-6 px-6 py-6 md:grid-cols-2">
          {/* 로고 / 좌측 */}
          <div className="flex h-full items-center justify-start gap-4">
            <img src="/logo/login-logo.png" alt="jobda" className="h-16 w-auto" />
          </div>

          {/* 링크 / 우측 */}
          <div className="flex md:justify-end">
            <ul className="text-base leading-8">
              <li className="mb-2 font-bold text-[var(--color-jd-violet)]">Jobda</li>
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
          <div className="mx-auto max-w-6xl px-6 py-5 text-right text-sm font-semibold text-[var(--color-jd-violet)]">
            © 2025 <span className="!font-bold">Jobda Inc.</span> All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
