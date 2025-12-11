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
import PositionSelect, { type PositionValue } from '@features/user/components/PositionSelect.tsx';

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

// 프로필 이미지 변경을 전역으로 알리는 이벤트 헬퍼
function broadcastProfileUpdate(profileUrl: string | null | undefined) {
  window.dispatchEvent(
    new CustomEvent('profile-updated', {
      detail: profileUrl ?? null,
    })
  );
}

// 전화번호 하이픈 자동 입력
function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '');

  if (digits.length < 4) return digits;
  if (digits.length < 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

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

  // 직책 관련 상태
  const [positionType, setPositionType] = useState<PositionValue | ''>(''); // select 값
  const [positionCustom, setPositionCustom] = useState(''); // 기타 직접 입력

  const KNOWN_POSITION_VALUES: PositionValue[] = [
    'OWNER',
    'HR_MANAGER',
    'TEAM_LEAD',
    'INTERVIEWER',
    'OTHER',
  ];

  const syncPositionFromSource = (source: { position: string }) => {
    const raw = source.position || '';
    if (KNOWN_POSITION_VALUES.includes(raw as PositionValue)) {
      setPositionType(raw as PositionValue);
      setPositionCustom('');
    } else if (raw) {
      setPositionType('OTHER');
      setPositionCustom(raw);
    } else {
      setPositionType('');
      setPositionCustom('');
    }
  };

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
        const nextUser = {
          name: me.name ?? '',
          email: me.email ?? '',
          nickname: me.nickname ?? '',
          phone: me.phoneNumber ?? '',
          company: me.companyName ?? '',
          position: me.position ?? '',
          birthDate: me.birthDate ?? '',
          gender: (me.gender ?? '') as Gender,
          profileUrl: me.profileUrl ?? '/images/default-profile.jpg',
        };

        setUser(nextUser);
        setForm(nextUser);
        syncPositionFromSource({ position: nextUser.position });

        // 사이드바로 현재 프로필 이미지보내기
        broadcastProfileUpdate(nextUser.profileUrl);
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
      if (e.key === 'reauthAt') checkReauth();
      console.log('reauthAt 변경 감지:', e.newValue);
      checkReauth();
    };
    window.addEventListener('storage', onStorage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  // 4) 의도에 따라 비밀번호 섹션 자동 오픈
  const [expandPassword, setExpandPassword] = useState(false);
  useEffect(() => {
    const focusParam = searchParams.get('focus') as Focus | null;
    if (focusParam === 'password') setExpandPassword(true);
  }, [searchParams]);

  // 5) 폼 변경 핸들러
  type FormKeys = 'name' | 'nickname' | 'phone' | 'position' | 'birthDate' | 'gender';

  const updateForm = (name: FormKeys, value: string) => {
    setForm((f) => {
      const next = { ...f, [name]: value };
      console.log('폼 변경:', { field: name, value, next });
      return next;
    });
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.target;
    updateForm(name as FormKeys, value);
  };

  const onSelectChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.target;
    updateForm(name as FormKeys, value);
  };

  const onCancel = () => {
    console.log('수정 취소', user);
    setForm(user);
    syncPositionFromSource({ position: user.position });
    setEditing(false);
  };

  // 6) 내 정보 저장
  const onSave = async () => {
    if (!form.name?.trim() || !form.nickname?.trim()) {
      showAlert('이름과 닉네임은 필수 항목입니다.', 'warning', '필수 항목 확인');
      return;
    }
    try {
      const finalPosition =
        positionType === 'OTHER' ? positionCustom.trim() : positionType || form.position;

      if (!finalPosition?.trim()) {
        showAlert('직책은 필수 항목입니다.', 'warning', '필수 항목 확인');
        return;
      }

      console.log('[MyPage] 저장 요청 payload:', {
        name: form.name,
        nickname: form.nickname,
        phoneNumber: form.phone,
        position: finalPosition,
        birthDate: form.birthDate,
        gender: form.gender || undefined,
      });
      await updateMe({
        name: form.name.trim(),
        nickname: form.nickname.trim(),
        phoneNumber: form.phone,
        position: finalPosition || undefined,
        birthDate: form.birthDate,
        gender: form.gender || undefined,
      });

      const next = {
        ...form,
        position: finalPosition || '',
      };
      setUser(next);
      setForm(next);
      syncPositionFromSource({ position: next.position });
      setEditing(false);
      showAlert('저장되었습니다.', 'success', '저장 완료');
    } catch (e) {
      console.error('updateMe 실패:', e);
      showAlert('저장 중 문제가 발생했습니다. 다시 시도해주세요.', 'error', '저장 실패');
    }
  };

  // 7) 비밀번호 변경 관련 상태 & 로직
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const piiSources: string[] = [
    user.name,
    user.email,
    user.nickname,
    user.phone,
    user.company,
  ].filter(Boolean);

  const checks = buildPasswordChecks(newPassword, piiSources);

  const validatePasswords = (cur: string, next: string, nextConfirm: string) => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!next || !nextConfirm) return;

    if (next !== nextConfirm) {
      setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (cur && cur === next) {
      setPasswordError('현재 비밀번호와 새 비밀번호가 같습니다. 다른 비밀번호를 입력해주세요.');
      return;
    }

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

      const newProfileUrl = updated.profileUrl ?? user.profileUrl ?? '/images/default-profile.jpg';

      setUser((prev) => ({
        ...prev,
        profileUrl: newProfileUrl,
      }));
      setForm((f) => ({
        ...f,
        profileUrl: newProfileUrl,
      }));

      // 프로필 변경 이벤트 브로드캐스트
      broadcastProfileUpdate(newProfileUrl);
    } catch (err) {
      console.error('프로필 이미지 업로드 실패:', err);
      showAlert('프로필 이미지 변경에 실패했습니다. 다시 시도해주세요.', 'success', '변경 실패');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const [confirmRemoveOpen, setConfirmRemoveOpen] = useState(false);

  const onClickRemovePhoto = () => {
    setConfirmRemoveOpen(true);
  };

  const handleConfirmRemovePhoto = async () => {
    try {
      setRemoving(true);
      const updated = (await removeProfileImage()) as MeResponse;

      const newProfileUrl = updated.profileUrl ?? '/images/default-profile.jpg';

      setUser((prev) => ({
        ...prev,
        profileUrl: newProfileUrl,
      }));
      setForm((f) => ({
        ...f,
        profileUrl: newProfileUrl,
      }));

      // [추가] 삭제 후에도 변경된 프로필을 브로드캐스트
      broadcastProfileUpdate(newProfileUrl);

      showAlert('프로필 이미지가 기본 이미지로 변경되었습니다.', 'success', '삭제 완료');
    } catch (err) {
      console.error('프로필 이미지 삭제 실패:', err);
      showAlert('프로필 이미지를 삭제하지 못했습니다. 다시 시도해주세요.', 'error', '삭제 실패');
    } finally {
      setRemoving(false);
      setConfirmRemoveOpen(false);
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
              <div className="h-full w-full overflow-hidden rounded-full bg-[var(--color-jd-gray-light)]">
                <img
                  src={resolvedProfileUrl}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              </div>

              {!isDefaultProfile && (
                <button
                  type="button"
                  onClick={onClickRemovePhoto}
                  disabled={removing || uploading}
                  aria-label="프로필 이미지 삭제"
                  className="absolute top-4 right-6 flex h-6 w-6 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[rgba(130,110,180,0.65)] text-xs font-bold text-white shadow-md backdrop-blur-sm transition hover:bg-[rgba(130,110,180,0.85)] disabled:opacity-50"
                >
                  x
                </button>
              )}
            </div>
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
                이메일<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="self-center font-semibold">{user.email}</div>

              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                이름<span className="ml-0.5 text-red-500">*</span>
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
                닉네임<span className="ml-0.5 text-red-500">*</span>
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
                전화번호
              </label>
              {editing ? (
                <input
                  name="phone"
                  value={form.phone}
                  onChange={(e) => {
                    const formatted = formatPhone(e.target.value);
                    updateForm('phone', formatted);
                  }}
                  className="rounded-md border px-3 py-2"
                  type="tel"
                  placeholder="예: 010-1234-5678"
                />
              ) : (
                <div className="self-center font-bold">{user.phone || ''}</div>
              )}

              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                생일
              </label>
              {editing ? (
                <input
                  name="birthDate"
                  value={form.birthDate}
                  onChange={onInputChange}
                  className="rounded-md border px-3 py-2"
                  type="date"
                  placeholder="예: 1999-02-15"
                />
              ) : (
                <div className="self-center font-semibold">{user.birthDate || ''}</div>
              )}

              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                성별
              </label>
              {editing ? (
                <select
                  name="gender"
                  value={form.gender}
                  onChange={onSelectChange}
                  className="h-10 w-full rounded-md border bg-white px-3 py-2"
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
                </div>
              )}
            </div>

            {/*  조직 정보 섹션 */}
            <h3 className="mt-8 mb-4 border-b border-black/10 pb-2 text-sm font-semibold text-[var(--color-jd-gray-dark)]">
              조직 정보
            </h3>

            <div className="grid grid-cols-1 gap-x-4 gap-y-6 text-[var(--color-jd-black)] sm:grid-cols-[110px_1fr] md:gap-y-7">
              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                회사<span className="ml-0.5 text-red-500">*</span>
              </label>
              <div className="self-center font-semibold">{user.company}</div>

              <label className="self-center font-semibold text-[var(--color-jd-gray-dark)]">
                직책<span className="ml-0.5 text-red-500">*</span>
              </label>
              {editing ? (
                <div className="flex flex-col gap-2">
                  <PositionSelect
                    value={positionType}
                    onChange={(next) => {
                      setPositionType(next);
                      if (next !== 'OTHER') {
                        setPositionCustom('');
                      }
                    }}
                    disabled={false}
                    hideLabel
                  />
                  {positionType === 'OTHER' && (
                    <input
                      value={positionCustom}
                      onChange={(e) => setPositionCustom(e.target.value)}
                      className="rounded-md border px-3 py-2"
                      placeholder="직책을 직접 입력해주세요 (예: 매니저)"
                    />
                  )}
                </div>
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
                e.preventDefault();

                if (newPassword !== newPasswordConfirm) {
                  setPasswordError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
                  setPasswordSuccess(null);
                  return;
                }

                if (!checks.english || !checks.digit || !checks.length || !checks.notContainsPII) {
                  setPasswordError('비밀번호 조건을 모두 충족해야 합니다.');
                  setPasswordSuccess(null);
                  return;
                }

                if (currentPassword && currentPassword === newPassword) {
                  setPasswordError(
                    '현재 비밀번호와 새 비밀번호가 같습니다. 다른 비밀번호를 입력해주세요.'
                  );
                  setPasswordSuccess(null);
                  return;
                }

                try {
                  await changePassword(currentPassword, newPassword);

                  localStorage.setItem('reauthAt', String(Date.now()));

                  showAlert('비밀번호가 성공적으로 변경되었습니다.', 'success', '변경 완료');

                  setCurrentPassword('');
                  setNewPassword('');
                  setNewPasswordConfirm('');
                  setPasswordError(null);
                  setPasswordSuccess(null);
                  setExpandPassword(false);
                } catch (err) {
                  console.log('비밀번호 변경 에러:', err);
                  setPasswordError(
                    '비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해주세요.'
                  );
                  setPasswordSuccess(null);
                }
              }}
              className="grid max-w-md gap-3"
            >
              <input
                type="password"
                placeholder="현재 비밀번호"
                className="rounded-md border px-4 py-2"
                required
                value={currentPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setCurrentPassword(value);
                  validatePasswords(value, newPassword, newPasswordConfirm);
                }}
              />

              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  placeholder="새 비밀번호"
                  className="rounded-md border px-4 py-2"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    const value = e.target.value;
                    setNewPassword(value);
                    validatePasswords(currentPassword, value, newPasswordConfirm);
                  }}
                />
                <div className="mt-1 flex flex-wrap gap-2">
                  <ReqBadge ok={checks.english} label="영문자" />
                  <ReqBadge ok={checks.digit} label="숫자" />
                  <ReqBadge ok={checks.length} label="8자 이상" />
                  <ReqBadge ok={checks.notContainsPII} label="개인정보 미포함" />
                </div>
              </div>

              <input
                type="password"
                placeholder="새 비밀번호 확인"
                className="rounded-md border px-4 py-2"
                required
                value={newPasswordConfirm}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPasswordConfirm(value);
                  validatePasswords(currentPassword, newPassword, value);
                }}
              />

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
      <AlertModal
        open={alertModal.open}
        type={alertModal.type}
        title={alertModal.title}
        message={alertModal.message}
        onClose={closeAlert}
      />
      <AlertModal
        open={confirmRemoveOpen}
        type="warning"
        title="프로필 이미지 삭제"
        message="현재 프로필 사진을 삭제하고 기본 이미지로 되돌릴까요?"
        onClose={() => setConfirmRemoveOpen(false)}
        onConfirm={handleConfirmRemovePhoto}
        confirmText="삭제"
      />
    </div>
  );
}
