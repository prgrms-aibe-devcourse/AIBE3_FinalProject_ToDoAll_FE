import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

type Focus = 'profile' | 'password' | undefined;

type Gender = '' | 'MALE' | 'FEMALE' | 'OTHER';

export default function MyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 목업 데이터
  const [user, setUser] = useState({
    name: '김민수',
    email: 'abck@gmail.com',
    phone: '010-1111-2222',
    company: '잡다 컴퍼니',
    position: '매니저',
    profile: 'https://i.imgur.com/8Km9tLL.png',
    birthDate: '',
    gender: '' as Gender,
  });

  // 편집 토글 & 폼 데이터
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(user);

  const [recentlyReauthed, setRecentlyReauthed] = useState(false); //TTL을 상태로 보유 → UI가 자동 갱신됨
  useEffect(() => {
    const checkReauth = () => {
      const at = Number(localStorage.getItem('reauthAt') || 0); //현재 저장된 재인증 시각 읽기
      setRecentlyReauthed(Date.now() - at < 5 * 60 * 1000); //5분 이내면 true
    };

    checkReauth(); //마운트 즉시 1회 평가 → 초기 표시 정확
    const interval = setInterval(checkReauth, 60 * 1000); //  1분 주기로
    const onStorage = (e: StorageEvent) => {
      // 다른 탭에서 reauthAt 갱신 시 동기화
      if (e.key === 'reauthAt') checkReauth();
    };
    window.addEventListener('storage', onStorage); // storage 이벤트 등록

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage); // 이벤트 리스너 정리
    };
  }, []);

  // 의도에 따라 비밀번호 섹션 자동 오픈
  const [expandPassword, setExpandPassword] = useState(false);
  useEffect(() => {
    const focusParam = searchParams.get('focus') as Focus | null; //URL 쿼리에서 focus 읽기
    if (focusParam === 'password') setExpandPassword(true); //  ?focus=password면 비번 섹션 자동 오픈
  }, [searchParams]); //URL 쿼리가 바뀌면 다시 평가

  // 타입 분리된 onChange 핸들러

  //  공통 업데이트 도우미(안전하게 키 제한)
  type FormKeys = 'name' | 'phone' | 'position' | 'birthDate' | 'gender';
  const updateForm = (name: FormKeys, value: string) => setForm((f) => ({ ...f, [name]: value }));

  // input 전용
  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    updateForm(name as FormKeys, value);
  };

  // select 전용
  const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    updateForm(name as FormKeys, value);
  };
  // ---------------------------

  const onCancel = () => {
    setForm(user);
    setEditing(false);
  };

  const onSave = () => {
    // TODO: 실제 API 연동 시 검증/요청
    setUser(form);
    setEditing(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start bg-[var(--color-jd-white)] px-6 py-10 font-[var(--default-font-family)] sm:px-6 sm:py-12 md:px-8">
      <div className="mt-10 mb-6 w-full max-w-[860px]">
        <h2 className="ml-2 text-left text-xl font-bold text-[var(--color-jd-black)] sm:text-2xl">
          마이페이지
        </h2>
      </div>

      {/* 메인 카드 */}
      <div className="w-full max-w-[900px] rounded-3xl bg-white p-8 shadow-[0_6px_12px_#00000025] sm:p-10 md:p-10">
        {/* X → 이전 페이지로 */}
        <div className="mb-6 flex w-full max-w-[860px] items-center justify-end">
          <button
            aria-label="닫기"
            onClick={() => navigate(-1)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-jd-black)] hover:bg-[var(--color-jd-gray-light)]"
          >
            X
          </button>
        </div>

        {/* 프로필 + 정보 */}
        <div className="mb-8 flex flex-col gap-8 sm:flex-row sm:gap-12">
          {/* 프로필 */}
          <div className="w-full self-center sm:w-40 sm:self-start">
            <div className="mx-auto mb-3 h-28 w-28 overflow-hidden rounded-full bg-[var(--color-jd-gray-light)] sm:mx-0 sm:h-40 sm:w-40">
              <img src={user.profile} alt="profile" className="h-full w-full object-cover" />
            </div>
            <button className="mt-4 w-full rounded-md bg-[var(--color-jd-gray-light)] py-2 text-sm">
              사진 변경
            </button>
          </div>

          {/* 정보 폼/뷰 */}
          {/* ===== 기본 정보 섹션 ===== */}
          <div className="flex-1">
            <h3 className="mb-4 border-b border-black/10 pb-2 text-sm font-semibold text-[var(--color-jd-gray-dark)]">
              기본 정보
            </h3>

            {/* 2열 그리드 */}
            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-[var(--color-jd-black)] sm:grid-cols-[110px_1fr]">
              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                이메일
              </label>
              {/* 이메일도 항상 읽기 전용 */}
              <div className="self-center font-semibold">{user.email}</div>

              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                이름
              </label>
              {editing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={onInputChange}
                  className="rounded-md border px-3 py-2"
                />
              ) : (
                <div className="self-center font-semibold">{user.name}</div>
              )}

              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                전화번호 (선택)
              </label>
              {editing ? (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onInputChange}
                  className="rounded-md border px-3 py-2"
                  type="tel"
                  placeholder="예: 010-1234-5678"
                />
              ) : (
                <div className="self-center font-bold">{user.phone || ''}</div> // 미입력 시 빈칸
              )}

              {/* [추가] 생일 */}
              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                생일 (선택)
              </label>
              {editing ? (
                <input
                  name="birthDate"
                  value={form.birthDate}
                  onChange={onInputChange}
                  className="rounded-md border px-3 py-2"
                  type="date"
                  placeholder="예: 1999-02-15" // [추가] 예시 표기(브라우저에 따라 미표시될 수 있음)
                />
              ) : (
                <div className="self-center font-semibold">{user.birthDate || ''}</div> // [변경] 미입력 시 빈칸
              )}

              {/* [추가] 성별 */}
              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                성별 (선택)
              </label>
              {editing ? (
                <select
                  name="gender"
                  value={form.gender}
                  onChange={onSelectChange}
                  className="rounded-md border bg-white px-3 py-2"
                >
                  <option value="">(선택 없음)</option>
                  <option value="MALE">남성</option>
                  <option value="FEMALE">여성</option>
                  <option value="OTHER">기타</option>
                </select>
              ) : (
                <div className="self-center font-semibold">
                  {user.gender === 'MALE'
                    ? '남성'
                    : user.gender === 'FEMALE'
                      ? '여성'
                      : user.gender === 'OTHER'
                        ? '기타'
                        : ''}
                </div> // [변경] 미입력 시 빈칸
              )}
            </div>

            {/* ===== 조직 정보 섹션 ===== */}
            <h3 className="mt-8 mb-4 border-b border-black/10 pb-2 text-sm font-semibold text-[var(--color-jd-gray-dark)]">
              조직 정보
            </h3>

            <div className="grid grid-cols-1 gap-x-4 gap-y-3 text-[var(--color-jd-black)] sm:grid-cols-[110px_1fr]">
              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                회사
              </label>
              <div className="self-center font-semibold">{user.company}</div>

              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                직책
              </label>
              {editing ? (
                <input
                  name="position"
                  value={form.position}
                  onChange={onInputChange}
                  className="rounded-md border px-3 py-2"
                  placeholder="예: 매니저"
                />
              ) : (
                <div className="self-center font-semibold">{user.position}</div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col justify-end gap-3 sm:flex-row sm:gap-4">
          {editing ? (
            <>
              <button
                onClick={onCancel}
                className="w-full rounded-md bg-[var(--color-jd-gray-light)] px-6 py-2 sm:w-auto"
              >
                취소
              </button>
              <button
                onClick={onSave}
                className="w-full rounded-md bg-[var(--color-jd-scarlet)] px-6 py-2 text-white sm:w-auto"
              >
                저장
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="rounded-md bg-[var(--color-jd-scarlet)] px-6 py-2 text-white"
              >
                회원 정보 수정
              </button>
              <button
                onClick={() => setExpandPassword((v) => !v)}
                className="rounded-md bg-[var(--color-jd-yellow)] px-6 py-2 !text-white"
              >
                {expandPassword ? '비밀번호 변경 닫기' : '비밀번호 변경'}
              </button>
            </>
          )}
        </div>

        {/* 비밀번호 변경 섹션 */}
        {expandPassword && (
          <div className="mt-8 rounded-2xl border border-[var(--color-jd-gray-light)] bg-[var(--color-jd-white)] p-6">
            {!recentlyReauthed && (
              <div className="mb-3 text-sm text-[var(--color-jd-gray-dark)]">
                보안을 위해 다시 한 번 비밀번호를 확인해야 합니다. (5분 경과)
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('비밀번호 변경 완료 (mock)');
              }}
              className="grid max-w-md gap-3"
            >
              <input
                type="password"
                placeholder="현재 비밀번호"
                className="rounded-md border px-4 py-2"
                required
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                className="rounded-md border px-4 py-2"
                required
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                className="rounded-md border px-4 py-2"
                required
              />
              <button className="mt-2 rounded-md bg-[var(--color-jd-violet)] px-5 py-2 text-white hover:bg-[var(--color-jd-violet-hover)]">
                비밀번호 변경 저장
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
