import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Interviewer } from '../types/interviewer';
import ApplicantProfileCard from '../components/create/ApplicantProfileCard';
import InterviewerSearchBox from '../components/create/InterviewerSearchBox';
import InvitedList from '../components/create/InvitedList';
import SchedulePicker from '../components/create/SchedulePicker';
import useFetch from '@shared/hooks/useFetch';

export default function InterviewCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resumeId = searchParams.get('resumeId');
  const jdId = searchParams.get('jdId');

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // 지원자 조회
  const { resData: applicant } = useFetch<any>(
    resumeId ? `/api/v1/resumes/${resumeId}/interview-info` : ''
  );

  // POST 요청에만 쓰는 상태
  const [createReq, setCreateReq] = useState<{
    url: string;
    method: string;
    body: any;
  } | null>(null);

  const { resData: createdInterview } = useFetch<any>(
    createReq?.url || '',
    null,
    createReq?.method,
    undefined,
    createReq?.body
  );

  // invites API 호출용 상태
  const [inviteReq, setInviteReq] = useState<{
    url: string;
    method: string;
    body: any;
  } | null>(null);

  const { resData: inviteResponse } = useFetch<{ resumeId: number }>(
    inviteReq?.url || '',
    null,
    inviteReq?.method,
    undefined,
    inviteReq?.body
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 임시 면접관 리스트
  const { resData: interviewers } = useFetch<Interviewer[]>(`/api/v1/users/domain`);

  const [invited, setInvited] = useState<Interviewer[]>([]);
  const [search, setSearch] = useState('');

  // 면접 생성 후 invites API 호출
  useEffect(() => {
    // createdInterview가 없으면 아무것도 하지 않음 (초기 로드 시 null)
    if (!createdInterview) return;

    // API 응답 구조: { interviewId: 13 }
    const interviewId = createdInterview.interviewId || createdInterview.id;

    if (!interviewId) {
      console.warn('[InterviewCreatePage] interviewId를 찾을 수 없습니다:', createdInterview);
      return;
    }

    console.log(
      '[InterviewCreatePage] 면접 생성 완료, invites API 호출:',
      interviewId,
      invited,
      resumeId
    );
    setInviteReq({
      url: `/api/v1/interviews/${interviewId}/invites`,
      method: 'POST',
      body: {
        resumeId: Number(resumeId),
      },
    });
  }, [createdInterview, invited]);

  // invites API 응답 처리 후 이동
  useEffect(() => {
    if (!inviteResponse) return;
    navigate('/interview/manage');
  }, [inviteResponse, navigate]);

  // 면접관 필터링
  const invitedIds = invited.map((i) => i.id);
  const filtered = useMemo(
    () =>
      interviewers
        ? interviewers.filter((i) => {
            // 이미 초대된 사람 제외
            if (invitedIds.includes(i.id)) return false;

            // 검색어가 없으면 전부 통과
            if (search.trim().length === 0) return true;

            // 검색어가 있으면 이름 or 이메일 필터
            return i.name.includes(search) || i.email.toLowerCase().includes(search.toLowerCase());
          })
        : [],
    [search, interviewers, invitedIds]
  );

  const handleInvite = (p: Interviewer) => {
    if (!invitedIds.includes(p.id)) {
      setInvited([...invited, p]);
      setSearch('');
    }
  };

  const handleRemove = (id: number) => {
    setInvited(invited.filter((i) => i.id !== id));
  };

  // 인터뷰 생성
  const handleSubmit = () => {
    if (!resumeId || !jdId) {
      alert('지원서와 공고 정보가 필요합니다.');
      return;
    }
    if (!date || !time) {
      alert('면접 일자를 선택하세요.');
      return;
    }

    setIsSubmitting(true);

    // 선택된 날짜 + 시간 하나의 ISO로 병합
    const scheduledAt = `${date}T${time}:00`;

    const body = {
      jdId: Number(jdId),
      resumeId: Number(resumeId),
      participantIds: invited.map((i) => i.id),
      scheduledAt,
    };

    setCreateReq({
      url: '/api/v1/interviews',
      method: 'POST',
      body,
    });
  };

  // Validation
  if (!resumeId || !jdId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        접근 오류: resumeId, jdId가 필요합니다
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        지원자 정보를 불러오는 중...
      </div>
    );
  }

  interface ApplicantProfile {
    name: string;
    email: string;
    phoneNumber?: string;
    birthDate?: string;
    avatar?: string;
    jdTitle?: string;
  }

  const profile: ApplicantProfile = {
    name: applicant.name,
    email: applicant.email,
    phoneNumber: applicant.phoneNumber,
    birthDate: applicant.birthDate,
    avatar: applicant.avatar,
    jdTitle: applicant.jdTitle,
  };

  return (
    <div className="flex min-h-screen bg-[#fbf9f9] px-12 py-8">
      <h1 className="mt-4 w-40 text-xl font-semibold">면접 생성</h1>

      <div className="mt-16 mr-40 flex flex-1 items-start justify-center rounded-3xl bg-white p-10 shadow-xl">
        <div className="flex w-full max-w-5xl gap-12">
          {/* 지원자 카드 */}
          <div className="flex-1">
            <ApplicantProfileCard applicant={profile} />

            {/* 날짜/시간 설정 이동 */}
            <SchedulePicker date={date} time={time} setDate={setDate} setTime={setTime} />
          </div>

          {/* 면접관 초대 */}
          <div className="relative flex flex-[1.2] flex-col">
            <h2 className="mb-4 text-lg font-semibold">면접관 초대</h2>

            <InterviewerSearchBox
              search={search}
              setSearch={setSearch}
              filtered={filtered}
              handleInvite={handleInvite}
            />
            <InvitedList invited={invited} handleRemove={handleRemove} />

            <button
              disabled={isSubmitting}
              className="mt-6 self-end rounded-lg bg-[#E35B43] px-6 py-2.5 font-semibold text-white transition hover:bg-[#d44f3a] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleSubmit}
            >
              {isSubmitting ? '생성 중...' : '면접 생성하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
