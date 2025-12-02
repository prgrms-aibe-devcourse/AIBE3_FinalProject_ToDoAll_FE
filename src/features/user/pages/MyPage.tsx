import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  getMe,
  updateMe,
  changePassword,
  uploadProfileImage,
  removeProfileImage,
} from '../api/user.api.ts';
import ReqBadge from '@features/auth/components/ReqBadge.tsx';
import { buildPasswordChecks } from '@features/auth/utils/passwordChecks.ts';
import { API_ORIGIN } from '@lib/utils/base.ts';
import AlertModal from '@components/Alertmodal.tsx';

type Focus = 'profile' | 'password' | undefined;

type Gender = '' | 'MALE' | 'FEMALE' | 'OTHER';

type MeResponse = {
  name?: string | null;
  email?: string | null;
  nickname?: string | null;
  phoneNumber?: string | null;
  companyName?: string | null;
  position?: string | null;
  birthDate?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  profileUrl?: string | null;
};

export default function MyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [alertModal, setAlertModal] = useState({
    open: false,
    type: 'info' as 'success' | 'error' | 'info' | 'warning',
    title: '',
    message: '',
  });

  // 모달 열기 헬퍼 함수
  const showAlert = (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    title?: string
  ) => {
    setAlertModal({ open: true, type, title: title || '', message });
  };

  // 모달 닫기
  const closeAlert = () => {
    setAlertModal((prev) => ({ ...prev, open: false }));
  };

  // 1) 편집 토글 & 유저 상태
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
    profileUrl: '/images/default-profile.jpg',
  });

  const [form, setForm] = useState(user);

  const isDefaultProfile = !user.profileUrl || user.profileUrl.includes('default-profile');

  const resolvedProfileUrl =
    user.profileUrl &&
    (user.profileUrl.startsWith('http://') ||
      user.profileUrl.startsWith('https://') ||
      user.profileUrl.startsWith('data:'))
      ? user.profileUrl
      : `${API_ORIGIN}${user.profileUrl || '/images/default-profile.jpg'}`;

  // 2) 내 정보 조회
  useEffect(() => {
    getMe()
      .then((data) => {
        console.log('getMe 응답:', data);
        const me = data as MeResponse;
        setUser((prev) => ({
          ...prev,
          name: me.name ?? prev.name,
          email: me.email ?? prev.email,
          nickname: me.nickname ?? prev.nickname,
          phone: me.phoneNumber ?? prev.phone,
          company: me.companyName ?? prev.company,
          position: me.position ?? prev.position,
          birthDate: me.birthDate ?? prev.birthDate,
          gender: (me.gender ?? prev.gender) as Gender,
          profileUrl: me.profileUrl ?? prev.profileUrl,
        }));
        // 폼에도 동일값 반영
        setForm((f) => ({
          ...f,
          name: me.name ?? f.name,
          email: me.email ?? f.email,
          nickname: me.nickname ?? f.nickname,
          phone: me.phoneNumber ?? f.phone,
          company: me.companyName ?? f.company,
          position: me.position ?? f.position,
          birthDate: me.birthDate ?? f.birthDate,
          gender: (me.gender ?? f.gender) as Gender,
          profileUrl: me.profileUrl || f.profileUrl,
        }));
      })
      .catch((err) => {
        console.log('getMe 응답:', err);
        showAlert('내 정보 조회에 실패했습니다. 다시 로그인 후 시도해주세요.', 'error');
      });
  }, [navigate]);

  // 3) 최근 재인증 여부

  const [recentlyReauthed, setRecentlyReauthed] = useState(false);

  useEffect(() => {
    const checkReauth = () => {
      const raw = localStorage.getItem('reauthAt') || '0';
      const at = Number(raw);
      const flag = Date.now() - at < 5 * 60 * 1000; //5분 이내면 true

      console.log('최근 재인증 체크:', { raw, at, recentlyReauthed: flag });

      setRecentlyReauthed(flag);
    };

    checkReauth(); //마운트 즉시 1회 평가
    const interval = setInterval(checkReauth, 60 * 1000); //  1분 주기로

    const onStorage = (e: StorageEvent) => {
      // 다른 탭에서 reauthAt 갱신 시 동기화
      if (e.key === 'reauthAt') checkReauth();

      console.log('reauthAt 변경 감지:', e.newValue);
      checkReauth();
    };
    window.addEventListener('storage', onStorage); // storage 이벤트 등록

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage); // 이벤트 리스너 정리
    };
  }, []);

  // 4) 의도에 따라 비밀번호 섹션 자동 오픈
  const [expandPassword, setExpandPassword] = useState(false);
  useEffect(() => {
    const focusParam = searchParams.get('focus') as Focus | null; //URL 쿼리에서 focus 읽기
    if (focusParam === 'password') setExpandPassword(true); //  ?focus=password면 비번 섹션 자동 오픈
  }, [searchParams]); //URL 쿼리가 바뀌면 다시 평가

  // 5) 폼 변경 핸들러
  type FormKeys = 'name' | 'nickname' | 'phone' | 'position' | 'birthDate' | 'gender';

  const updateForm = (name: FormKeys, value: string) => {
    setForm((f) => {
      const next = { ...f, [name]: value };
      console.log('폼 변경:', { field: name, value, next });
      return next;
    });
  };

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
    console.log('수정 취소', user);
    setForm(user);
    setEditing(false);
  };

  // 6) 내 정보 저장
  const onSave = async () => {
    try {
      console.log('[MyPage] 저장 요청 payload:', {
        name: form.name,
        nickname: form.nickname,
        phoneNumber: form.phone,
        position: form.position,
        birthDate: form.birthDate,
        gender: form.gender || undefined,
      });
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
      showAlert('저장되었습니다.', 'success', '저장 완료');
    } catch (e) {
      console.error('updateMe 실패:', e);
      showAlert('저장 중 문제가 발생했습니다. 다시 시도해주세요.', 'error', '저장 실패');
    }
  };

  // 7) 비밀번호 변경 관련 상태 & 로직

  const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호 입력값
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호 입력값
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(''); // 새 비밀번호 확인 입력값

  const [passwordError, setPasswordError] = useState<string | null>(null); // 비밀번호 관련 에러 메시지
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null); // 비밀번호 관련 성공/안내 메시지

  // 비밀번호 강도/조건 체크용 개인정보 후보
  const piiSources: string[] = [
    user.name,
    user.email,
    user.nickname,
    user.phone,
    user.company,
  ].filter(Boolean);

  // 새 비밀번호에 대한 조건 체크
  const checks = buildPasswordChecks(newPassword, piiSources);

  // 비밀번호 입력 검증 함수
  const validatePasswords = (cur: string, next: string, nextConfirm: string) => {
    // 먼저 메시지 초기화
    setPasswordError(null);
    setPasswordSuccess(null);

    // 새 비밀번호/확인 비밀번호 둘 중 하나라도 비어 있으면 아직 판단하지 않음
    if (!next || !nextConfirm) return;

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

  //  프로필 이미지 변경 관련 로직
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const onClickChangePhoto = () => {
    fileInputRef.current?.click();
  };

  const onChangeProfileFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      showAlert(
        '이미지 용량이 너무 큽니다. \n 최대 5MB 파일만 업로드할 수 있어요.',
        'error',
        '업로드 실패'
      );
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      const updated = (await uploadProfileImage(file)) as MeResponse;

      // 응답에서 profileUrl만 업데이트
      setUser((prev) => ({
        ...prev,
        profileUrl: updated.profileUrl ?? prev.profileUrl,
      }));
      setForm((f) => ({
        ...f,
        profileUrl: updated.profileUrl ?? f.profileUrl,
      }));
    } catch (err) {
      console.error('프로필 이미지 업로드 실패:', err);
      showAlert('프로필 이미지 변경에 실패했습니다. 다시 시도해주세요.', 'success', '변경 실패');
    } finally {
      setUploading(false);
      // 같은 파일 다시 선택해도 change 이벤트 뜨도록 초기화
      e.target.value = '';
    }
  };

  const onClickRemovePhoto = async () => {
    if (!window.confirm('현재 프로필 사진을 삭제하고 기본 이미지로 되돌릴까요?')) return;

    try {
      setRemoving(true);

      const updated = (await removeProfileImage()) as MeResponse;

      setUser((prev) => ({
        ...prev,
        profileUrl: updated.profileUrl ?? prev.profileUrl,
      }));

      setForm((f) => ({
        ...f,
        profileUrl: updated.profileUrl ?? f.profileUrl,
      }));
    } catch (err) {
      console.error('프로필 이미지 삭제 실패:', err);
      showAlert('프로필 이미지를 삭제하지 못했습니다. 다시 시도해주세요.', 'error');
    } finally {
      setRemoving(false);
    }
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
            <div className="relative mx-auto mb-3 h-28 w-28 sm:mx-0 sm:h-40 sm:w-40">
              {/* 동그란 이미지 박스 */}
              <div className="h-full w-full overflow-hidden rounded-full bg-[var(--color-jd-gray-light)]">
                <img
                  src={resolvedProfileUrl}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* 기본 이미지가 아닐 때만 X 버튼 */}
              {!isDefaultProfile && (
                <button
                  type="button"
                  onClick={onClickRemovePhoto}
                  disabled={removing || uploading}
                  aria-label="프로필 이미지 삭제"
                  className="absolute top-5 right-6 flex h-6 w-6 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(130,110,180,0.65)] text-xs font-bold text-white shadow-md backdrop-blur-sm transition hover:bg-[rgba(130,110,180,0.85)] disabled:opacity-50"
                >
                  x
                </button>
              )}
            </div>
            {/* 숨겨진 파일 업로더 */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={onChangeProfileFile}
            />

            <button
              type="button"
              onClick={onClickChangePhoto}
              disabled={uploading}
              className="mt-4 w-full rounded-md bg-[var(--color-jd-gray-light)] py-2 text-sm disabled:opacity-60"
            >
              {uploading ? '업로드 중...' : '사진 변경'}
            </button>
          </div>

          {/* 기본 정보 섹션 */}
          <div className="flex-1">
            <h3 className="mb-4 border-b border-black/10 pb-2 text-sm font-semibold text-[var(--color-jd-gray-dark)]">
              기본 정보
            </h3>

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 text-[var(--color-jd-black)] sm:grid-cols-[110px_1fr] md:gap-y-7">
              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                이메일
              </label>
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
                닉네임
              </label>
              {editing ? (
                <input
                  name="nickname"
                  value={form.nickname}
                  onChange={onInputChange}
                  className="rounded-md border px-3 py-2"
                  type="nickname"
                  placeholder="예: 잡다닉"
                />
              ) : (
                <div className="self-center font-bold">{user.nickname}</div>
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

            {/*  조직 정보 섹션 */}
            <h3 className="mt-8 mb-4 border-b border-black/10 pb-2 text-sm font-semibold text-[var(--color-jd-gray-dark)]">
              조직 정보
            </h3>

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 text-[var(--color-jd-black)] sm:grid-cols-[110px_1fr] md:gap-y-7">
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
              onSubmit={async (e) => {
                e.preventDefault(); // 기본 submit 동작 막기

                // 1) 새 비밀번호 / 확인 비밀번호 일치 여부
                if (newPassword !== newPasswordConfirm) {
                  setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
                  setPasswordSuccess(null);
                  return;
                }

                // 2) 비밀번호 규칙(영문/숫자/길이/PII) 체크
                if (!checks.english || !checks.digit || !checks.length || !checks.notContainsPII) {
                  setPasswordError('비밀번호 조건을 모두 충족해야 합니다.');
                  setPasswordSuccess(null);
                  return;
                }

                // 3) 현재 비밀번호와 다른지
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

                  showAlert('비밀번호가 성공적으로 변경되었습니다.', 'success', '변경 완료');

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
              className="grid max-w-md gap-3"
            >
              {/* 현재 비밀번호 입력 */}

              <input
                type="password"
                placeholder="현재 비밀번호"
                className="rounded-md border px-4 py-2"
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
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  className="rounded-md border px-4 py-2"
                  required
                  value={newPassword} // state와 연결
                  onChange={(e) => {
                    const value = e.target.value; // 입력값
                    setNewPassword(value); // 상태 업데이트
                    // 새 비밀번호 검증 재실행
                    validatePasswords(currentPassword, value, newPasswordConfirm);
                  }}
                />
                {/* 비밀번호 조건 뱃지 영역 */}
                <div className="mt-1 flex flex-wrap gap-2">
                  <ReqBadge ok={checks.english} label="영문자" />
                  <ReqBadge ok={checks.digit} label="숫자" />
                  <ReqBadge ok={checks.length} label="8자 이상" />
                  <ReqBadge ok={checks.notContainsPII} label="개인정보 미포함" />
                </div>
              </div>

              {/* 새 비밀번호 확인 입력 */}
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                className="rounded-md border px-4 py-2"
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
              {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
              {!passwordError && passwordSuccess && (
                <p className="mt-1 text-sm text-green-600">{passwordSuccess}</p>
              )}

              <button className="mt-2 rounded-md bg-[var(--color-jd-violet)] px-5 py-2 text-white hover:bg-[var(--color-jd-violet-hover)]">
                비밀번호 변경 저장
              </button>
            </form>
          </div>
        )}
      </div>
      {/* 범용 알림 모달 */}
      <AlertModal
        open={alertModal.open}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={closeAlert}
      />
    </div>
  );
}
