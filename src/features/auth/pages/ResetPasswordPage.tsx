import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell';
import ReqBadge from '../components/ReqBadge';
import { buildPasswordChecks } from '../utils/passwordChecks';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [touched, setTouched] = useState({
    password: false,
    passwordConfirm: false,
  });
  const [didSubmit, setDidSubmit] = useState(false);

  useEffect(() => {
    if (!token) {
      setServerError('유효하지 않은 링크입니다. 이메일의 버튼을 다시 눌러 주세요.');
    }
  }, [token]);

  //  공통 비밀번호 조건
  const checks = buildPasswordChecks(password, []);

  //  제출 가능 여부를 공통 규칙 + 일치 여부로 계산
  const canSubmit =
    !!token &&
    checks.english &&
    checks.digit &&
    checks.length &&
    checks.notContainsPII &&
    password === passwordConfirm;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDidSubmit(true);
    if (!canSubmit) {
      setServerError('비밀번호 조건을 확인해주세요.');
      return;
    }
    setSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch('/api/auth/password/reset', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
        credentials: 'include',
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data && (data as any).message) || '서버 오류가 발생했습니다.');
      }
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err: any) {
      setServerError(err?.message || '비밀번호 재설정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell showLeftPane={false} caption={null} cardClassName="max-w-2xl">
      <form onSubmit={onSubmit} className="w-full px-6 py-8">
        <h3 className="text-2xl font-semibold mb-4 text-[#413D3D]">계정 비밀번호 재설정</h3>

        {!serverError ? (
          <p className="text-l font-semibold text-[#837C7C] mb-6">
            이메일에서 받은 버튼을 통해 접속했습니다. 안전한 비밀번호를 입력해주세요.
          </p>
        ) : (
          <div className="mb-4 text-l font-semibold text-red-600">{serverError}</div>
        )}

        {/* 새 비밀번호 */}
        <div className="mb-4">
          <label className="block text-sm text-[#413D3D] mb-2">새 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            placeholder="영문자, 숫자 8자 이상"
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none"
            autoComplete="new-password"
          />

          <div className="mt-2 flex flex-wrap gap-2">
            <ReqBadge ok={checks.english} label="영문자" />
            <ReqBadge ok={checks.digit} label="숫자" />
            <ReqBadge ok={checks.length} label="8자 이상" />
            <ReqBadge ok={checks.notContainsPII} label="개인정보 미포함" />
          </div>
        </div>

        {/* 새 비밀번호 확인 */}
        <div className="mb-6">
          <label className="block text-sm text-[#413D3D] mb-2">새 비밀번호 확인</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={() => setTouched((p) => ({ ...p, passwordConfirm: true }))}
            placeholder="새 비밀번호를 다시 입력하세요"
            className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none"
            autoComplete="new-password"
          />

          {/* 불일치 에러 표시 */}
          {(touched.passwordConfirm || didSubmit) &&
            passwordConfirm &&
            password !== passwordConfirm && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span aria-hidden>ⓘ</span> 비밀번호가 일치하지 않습니다
              </p>
            )}
        </div>

        {/* 서버/성공 메시지 */}

        {success && (
          <div className="mb-4 text-sm text-green-600">
            비밀번호가 변경되었습니다. 곧 로그인 화면으로 이동합니다.
          </div>
        )}

        {/* 버튼 */}
        <button
          type="submit"
          disabled={!canSubmit || submitting || success}
          className="w-full rounded-xl py-3 font-semibold text-white bg-[#752F6D] disabled:opacity-50"
        >
          {submitting ? '처리중...' : success ? '완료' : '비밀번호 변경하기'}
        </button>

        <div className="mt-4 text-center text-xs text-[#837C7C]">
          비밀번호 재설정 링크는 보안을 위해 발송 후 12시간 동안만 유효합니다.
        </div>
      </form>
    </AuthShell>
  );
}
