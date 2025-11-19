import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMe, updateMe, changePassword } from '../api/user.api.ts';

type Focus = 'profile' | 'password' | undefined;

type Gender = '' | 'MALE' | 'FEMALE' | 'OTHER';

export default function MyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 편집 토글 & 폼 데이터
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    nickname: '',
    phone: '',
    company: '',
    position: '',
    birthDate: '',
    gender: '' as Gender,
    profile: '/default-profile.png',
  });

  const [form, setForm] = useState(user);

  // 마운트 시 내 정보 실제 조회 → 화면/폼에 반영
  useEffect(() => {
    getMe()
      .then((data) => {
        console.log('getMe 응답:', data);
        setUser((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
          nickname: data.nickname,
          phone: data.phoneNumber ?? '',
          company: data.companyName ?? '',
          position: data.position ?? '',
          birthDate: data.birthDate ?? '',
          gender: (data.gender ?? '') as Gender,
          profile: data.profileUrl || prev.profile,
        }));
        // 폼에도 동일값 반영
        setForm((f) => ({
          ...f,
          name: data.name ?? f.name,
          email: data.email ?? f.email,
          nickname: data.nickname ?? f.nickname,
          phone: data.phoneNumber ?? f.phone,
          company: data.companyName ?? f.company,
          position: data.position ?? f.position,
          birthDate: data.birthDate ?? f.birthDate,
          gender: (data.gender ?? f.gender) as Gender,
          profile: data.profileUrl || f.profile,
        }));
      })
      .catch((err) => {
        console.log('getMe 응답:', err);
        alert('내 정보 조회에 실패했습니다.');
      });
  }, [navigate]);

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
  type FormKeys = 'name' | 'nickname' | 'phone' | 'position' | 'birthDate' | 'gender';
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

  //  API 연동: 내 정보 저장
  const onSave = async () => {
    try {
      await updateMe({
        name: form.name,
        nickname: form.nickname,
        phoneNumber: form.phone,
        position: form.position,
        birthDate: form.birthDate,
        gender: form.gender || undefined,
      });
      setUser(form);
      setEditing(false);
      alert('저장되었습니다.');
    } catch {
      alert('저장에 실패했습니다.');
    }
  };
  // 비밀번호 변경 관련 상태 & 로직

  const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 입력값
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 입력값
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(''); // 새 비밀번호 확인 입력값

  const [passwordError, setPasswordError] = useState<string | null>(null); // 비밀번호 관련 에러 메시지
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null); // 비밀번호 관련 성공/안내 메시지

  // 비밀번호 입력 검증 함수
  const validatePasswords = (cur: string, next: string, nextConfirm: string) => {
    // 먼저 메시지 초기화
    setPasswordError(null);
    setPasswordSuccess(null);

    // 새 비밀번호/확인 비밀번호 둘 중 하나라도 비어 있으면 아직 판단하지 않음
    if (!next || !nextConfirm) {
      return; // 아무 메시지도 띄우지 않음
    }

    // 새 비밀번호와 확인 비밀번호가 다를 때
    if (next !== nextConfirm) {
      setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 새 비밀번호가 현재 비밀번호와 같을 때
    if (cur && cur === next) {
      setPasswordError('현재 비밀번호와 새 비밀번호가 같습니다. 다른 비밀번호를 입력해주세요.');
      return;
    }

    // 위 조건을 다 통과하면 사용 가능한 비밀번호로 판단
    setPasswordSuccess('사용 가능한 비밀번호입니다.');
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
                닉네임
              </label>
              {editing ? (
                <input
                  name="nickname"
                  value={form.nickname}
                  onChange={onInputChange}
                  className="border rounded-md px-3 py-2"
                  type="nickname"
                  placeholder="예: 잡다닉"
                />
              ) : (
                <div className="self-center font-bold">{user.nickname}</div>
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
              onSubmit={async (e) => {
                e.preventDefault(); // 기본 submit 동작 막기

                // 제출 시 최종 검증: 새 비밀번호 일치 여부
                if (newPassword !== newPasswordConfirm) {
                  setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
                  setPasswordSuccess(null);
                  return;
                }

                // 제출 시 최종 검증: 현재 비밀번호와 새 비밀번호 동일 여부
                if (currentPassword && currentPassword === newPassword) {
                  setPasswordError(
                    '현재 비밀번호와 새 비밀번호가 같습니다. 다른 비밀번호를 입력해주세요.'
                  );
                  setPasswordSuccess(null);
                  return;
                }

                try {
                  // 실제 비밀번호 변경 API 호출
                  await changePassword(currentPassword, newPassword);

                  // 재인증 시간 기록
                  localStorage.setItem('reauthAt', String(Date.now()));

                  alert('비밀번호가 변경되었습니다.'); // 성공 알림

                  // 입력값 및 메시지 초기화
                  setCurrentPassword('');
                  setNewPassword('');
                  setNewPasswordConfirm('');
                  setPasswordError(null);
                  setPasswordSuccess(null);

                  // 비밀번호 변경 섹션 자동으로 닫기
                  setExpandPassword(false);
                } catch (err) {
                  console.log('비밀번호 변경 에러:', err); // 콘솔 로그
                  setPasswordError(
                    '비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해주세요.'
                  );
                  setPasswordSuccess(null);
                }
              }}
              className="grid gap-3 max-w-md"
            >
              {/* 현재 비밀번호 입력 */}
              <input
                type="password"
                placeholder="현재 비밀번호"
                className="border rounded-md px-4 py-2"
                required
                value={currentPassword} // state와 연결
                onChange={(e) => {
                  const value = e.target.value; // 입력값
                  setCurrentPassword(value); // 상태 업데이트
                  // 새 비밀번호 검증 재실행
                  validatePasswords(value, newPassword, newPasswordConfirm);
                }}
              />

              {/* 새 비밀번호 입력 */}
              <input
                type="password"
                placeholder="새 비밀번호"
                className="border rounded-md px-4 py-2"
                required
                value={newPassword} // state와 연결
                onChange={(e) => {
                  const value = e.target.value; // 입력값
                  setNewPassword(value); // 상태 업데이트
                  // 새 비밀번호 검증 재실행
                  validatePasswords(currentPassword, value, newPasswordConfirm);
                }}
              />

              {/* 새 비밀번호 확인 입력 */}
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                className="border rounded-md px-4 py-2"
                required
                value={newPasswordConfirm} // state와 연결
                onChange={(e) => {
                  const value = e.target.value; // 입력값
                  setNewPasswordConfirm(value); // 상태 업데이트
                  // 새 비밀번호 검증 재실행
                  validatePasswords(currentPassword, newPassword, value);
                }}
              />

              {/* 비밀번호 검증 메시지 영역 */}
              {passwordError && <p className="text-sm text-red-500 mt-1">{passwordError}</p>}
              {!passwordError && passwordSuccess && (
                <p className="text-sm text-green-600 mt-1">{passwordSuccess}</p>
              )}

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
