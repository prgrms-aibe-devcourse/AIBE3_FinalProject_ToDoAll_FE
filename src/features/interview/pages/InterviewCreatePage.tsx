import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import type { Interviewer } from '../types/interviewer';
import ApplicantProfileCard from '../components/create/ApplicantProfileCard';
import InterviewerSearchBox from '../components/create/InterviewerSearchBox';
import InvitedList from '../components/create/InvitedList';
import useFetch from '@/hooks/useFetch';

export default function InterviewCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const resumeId = searchParams.get('resumeId');
  const jdId = searchParams.get('jdId');

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

  // POST 요청 결과 처리
  useEffect(() => {
    if (!createdInterview) return;
    navigate('/interview/manage');
  }, [createdInterview]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 임시 면접관 리스트
  const [interviewers] = useState<Interviewer[]>([
    { id: 1, name: '박철수', email: 'abcd@gmail.com', avatar: '/avatar.png' },
    { id: 2, name: '이영희', email: 'lee@gmail.com', avatar: '/avatar.png' },
    { id: 3, name: '김민수', email: 'kim@gmail.com', avatar: '/avatar.png' },
  ]);

  const [invited, setInvited] = useState<Interviewer[]>([]);
  const [search, setSearch] = useState('');

  // 면접관 필터링
  const invitedIds = invited.map((i) => i.id);
  const filtered = useMemo(
    () =>
      search.trim().length > 0
        ? interviewers.filter(
            (i) =>
              !invitedIds.includes(i.id) &&
              (i.name.includes(search) || i.email.toLowerCase().includes(search.toLowerCase()))
          )
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

    setIsSubmitting(true);

    const body = {
      jdId: Number(jdId),
      resumeId: Number(resumeId),
      participantIds: invited.map((i) => i.id),
      scheduledAt: new Date().toISOString(), // TODO: 날짜 입력 UI 붙일 예정
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
