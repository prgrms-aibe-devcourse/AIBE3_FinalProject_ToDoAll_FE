import type React from 'react';
import { useState } from 'react';
import AuthShell from '../components/AuthShell';

const PERSONAL_DOMAINS = new Set([
  'gmail.com',
  'naver.com',
  'daum.net',
  'hanmail.net',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'icloud.com',
]);

export default function SignupCompanyEmailPage() {
  const [email, setEmail] = useState('');
  const [invalid, setInvalid] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);

    const at = value.lastIndexOf('@');
    const domain = at >= 0 ? value.slice(at + 1).toLowerCase() : '';
    // 비어있거나 개인용 도메인이면 경고
    setInvalid(Boolean(domain) && PERSONAL_DOMAINS.has(domain));
  };
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (invalid || !email) return; // 회사 이메일 아닐 때 전송 막기
    // TODO: 이메일 인증 로직
    // 서버에서도 반드시 2차 검증(화이트리스트/블랙리스트) 수행할 것
    console.log('회사 이메일 인증 요청:', email);
  };

  return (
    <AuthShell>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label className="block text-sm font-semibold text-jd-black">회사 이메일</label>

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
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="name@jobda.com"
              className="h-12 w-full rounded-full border border-jd-gray-light
              bg-jd-white pl-12 pr-5 text-[#413F3F] placeholder:text-jd-gray-dark/70
              outline-none shadow-[inset_0_1px_0_rgba(255,255,255,.7),0_2px_8px_rgba(0,0,0,.06)]
              focus:border-jd-gray-light focus:ring-0"
              style={{ borderRadius: 15, paddingLeft: '3rem' }}
            />
          </div>
          {/* 경고 문구 */}
          {invalid && (
            <div
              id="email-warning"
              className="flex items-start gap-1 text-[13px] text-[#D13B3B] leading-tight border-t border-[#D13B3B]/30 pt-2"
            >
              <span className="mt-[1px]">ⓘ</span>
              <span>
                기업 이메일로 가입해 주세요. 잡다는 기업 전용 채용 관리 솔루션으로 기업 이메일을
                통한 가입을 권장하고 있습니다.
              </span>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!email || invalid}
          className="h-12 w-full !rounded-[15px] !text-white font-extrabold !bg-[#752F6D] [background-image:none]
          !opacity-100 shadow-[0_4px_12px_rgba(117,47,109,.25)] hover:brightness-[1.05] active:brightness-95 transition
          ${!email || invalid ? 'bg-[#752F6D]/60 cursor-not-allowed' : 'bg-[#752F6D] hover:brightness-[1.05] active:brightness-95'}`}
          style={{ height: 44 }"
          style={{ height: 44 }}
        >
          이메일 인증
        </button>
      </form>
    </AuthShell>
  );
}
