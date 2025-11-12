import React, { useEffect, useState } from 'react';
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
    <div className="min-h-screen flex flex-col items-center justify-start bg-[var(--color-jd-white)] font-[var(--default-font-family)] px-6 sm:px-6 md:px-8 py-10 sm:py-12">
      <div className="w-full max-w-[860px] mb-6 mt-10">
        <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-jd-black)] text-left ml-2">
          마이페이지
        </h2>
      </div>

      {/* 메인 카드 */}
      <div className="bg-white rounded-3xl shadow-[0_6px_12px_#00000025] w-full max-w-[900px] p-8 sm:p-10 md:p-10">
        {/* X → 이전 페이지로 */}
        <div className="w-full max-w-[860px] flex items-center justify-end mb-6 ">
          <button
            aria-label="닫기"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center
               text-[var(--color-jd-black)] hover:bg-[var(--color-jd-gray-light)]"
          >
            X
          </button>
        </div>

        {/* 프로필 + 정보 */}
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 mb-8">
          {/* 프로필 */}
          <div className="w-full sm:w-40 self-center sm:self-start">
            <div className="mx-auto sm:mx-0 w-28 h-28 sm:w-40 sm:h-40 rounded-full bg-[var(--color-jd-gray-light)] overflow-hidden mb-3">
              <img src={user.profile} alt="profile" className="w-full h-full object-cover" />
            </div>
            <button className="w-full bg-[var(--color-jd-gray-light)] rounded-md py-2 text-sm mt-4">
              사진 변경
            </button>
          </div>

          {/* 정보 폼/뷰 */}
          {/* ===== 기본 정보 섹션 ===== */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-[var(--color-jd-gray-dark)] pb-2 mb-4 border-b border-black/10">
              기본 정보
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-y-6 md:gap-y-7 gap-x-4 text-[var(--color-jd-black)]">
              <label className="text-[var(--color-jd-gray-dark)] font-semibold self-center">
                이메일
              </label>
              {/* 이메일도 항상 읽기 전용 */}
              <div className="self-center font-semibold">{user.email}</div>

              <label className="text-[var(--color-jd-gray-dark)] font-semibold self-center">
                이름
              </label>
              {editing ? (
                <input
                  name="name"
                  value={form.name}
                  onChange={onInputChange}
                  className="border rounded-md px-3 py-2"
                />
              ) : (
                <div className="self-center font-semibold">{user.name}</div>
              )}

              <label className="text-[var(--color-jd-gray-dark)] font-semibold self-center">
                전화번호 (선택)
              </label>
              {editing ? (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onInputChange}
                  className="border rounded-md px-3 py-2"
                  type="tel"
                  placeholder="예: 010-1234-5678"
                />
              ) : (
                <div className="self-center font-bold">{user.phone || ''}</div> // 미입력 시 빈칸
              )}

              {/* [추가] 생일 */}
              <label className="text-[var(--color-jd-gray-dark)] font-semibold self-center">
                생일 (선택)
              </label>
              {editing ? (
                <input
                  name="birthDate"
                  value={form.birthDate}
                  onChange={onInputChange}
                  className="border rounded-md px-3 py-2"
                  type="date"
                  placeholder="예: 1999-02-15" // [추가] 예시 표기(브라우저에 따라 미표시될 수 있음)
                />
              ) : (
                <div className="self-center font-semibold">{user.birthDate || ''}</div> // [변경] 미입력 시 빈칸
              )}

              {/* [추가] 성별 */}
              <label className="text-[var(--color-jd-gray-dark)] font-semibold self-center">
                성별 (선택)
              </label>
              {editing ? (
                <select
                  name="gender"
                  value={form.gender}
                  onChange={onSelectChange}
                  className="border rounded-md px-3 py-2 bg-white"
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
            <h3 className="text-sm font-semibold text-[var(--color-jd-gray-dark)] pb-2 mt-8 mb-4 border-b border-black/10">
              조직 정보
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-y-6 md:gap-y-7 gap-x-4 text-[var(--color-jd-black)]">
              <label className="text-[var(--color-jd-gray-dark)] font-semibold self-center">
                회사
              </label>
              <div className="self-center font-semibold">{user.company}</div>

              <label className="text-[var(--color-jd-gray-dark)] font-semibold self-center">
                직책
              </label>
              {editing ? (
                <input
                  name="position"
                  value={form.position}
                  onChange={onInputChange}
                  className="border rounded-md px-3 py-2"
                  placeholder="예: 매니저"
                />
              ) : (
                <div className="self-center font-semibold">{user.position}</div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
          {editing ? (
            <>
              <button
                onClick={onCancel}
                className="w-full sm:w-auto px-6 py-2 rounded-md bg-[var(--color-jd-gray-light)]"
              >
                취소
              </button>
              <button
                onClick={onSave}
                className="w-full sm:w-auto px-6 py-2 rounded-md bg-[var(--color-jd-scarlet)] text-white"
              >
                저장
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 rounded-md bg-[var(--color-jd-scarlet)] text-white"
              >
                회원 정보 수정
              </button>
              <button
                onClick={() => setExpandPassword((v) => !v)}
                className="px-6 py-2 rounded-md bg-[var(--color-jd-yellow)] !text-white"
              >
                {expandPassword ? '비밀번호 변경 닫기' : '비밀번호 변경'}
              </button>
            </>
          )}
        </div>

        {/* 비밀번호 변경 섹션 */}
        {expandPassword && (
          <div className="mt-8 rounded-2xl border border-[var(--color-jd-gray-light)] p-6 bg-[var(--color-jd-white)]">
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
              className="grid gap-3 max-w-md"
            >
              <input
                type="password"
                placeholder="현재 비밀번호"
                className="border rounded-md px-4 py-2"
                required
              />
              <input
                type="password"
                placeholder="새 비밀번호"
                className="border rounded-md px-4 py-2"
                required
              />
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                className="border rounded-md px-4 py-2"
                required
              />
              <button className="mt-2 bg-[var(--color-jd-violet)] hover:bg-[var(--color-jd-violet-hover)] text-white rounded-md px-5 py-2">
                비밀번호 변경 저장
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
