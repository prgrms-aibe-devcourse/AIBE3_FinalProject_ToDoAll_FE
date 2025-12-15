import emptyHeartImg from '../../../assets/Favorite-2.png';
import fullHeartImg from '../../../assets/Heart.png';
import { useState, type MouseEvent } from 'react';
import type { MatchCardData } from '../types/matchCardData.types';

type Props = {
  resume: MatchCardData;
  matchRate: number;
  tab: 'recommended' | 'all';
  onView: () => void;
  onInvite: () => void;
};

export default function MatchCard({ resume, matchRate, tab, onView, onInvite }: Props) {
  const [checked, setChecked] = useState(false);

  const handleBookmark = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setChecked((prev) => !prev);
  };

  const numericRate =
    resume.skillMatchRate != null && resume.skillMatchRate !== ''
      ? parseFloat(resume.skillMatchRate)
      : matchRate;

  const rateLabel =
    resume.skillMatchRate != null && resume.skillMatchRate !== ''
      ? resume.skillMatchRate
      : `${matchRate}%`;

  let statusLabel: string | null = null;
  let statusClass = 'bg-[#9CA3AF]';

  if (tab === 'all' && resume.status) {
    switch (resume.status) {
      case 'RECOMMENDED':
        statusLabel = '추천';
        statusClass = 'bg-[#F7A534]';
        break;
      case 'APPLIED':
        statusLabel = '지원';
        statusClass = 'bg-[#6B7280]';
        break;
      case 'CONFIRMED':
        statusLabel = '매칭 확정';
        statusClass = 'bg-[#4CAF50]';
        break;
      default:
        statusLabel = null;
    }
  }

  return (
    <div
      className="relative mx-auto flex w-full cursor-pointer rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg"
      onClick={onView}
    >
      <div className="flex w-full items-start gap-4 pr-[160px]">
        {/* 프로필 이미지 */}
        <img
          src={resume.profileImage || '/images/default-profile.jpg'}
          alt={resume.name}
          className="h-24 w-24 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/default-profile.jpg';
          }}
        />

        <div className="flex w-full flex-col justify-between">
          <div>
            {/* 이름 + 상태 배지 */}
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-[24px] font-semibold text-[#413F3F]">{resume.name}</h2>

              {tab === 'recommended' && (
                <span className="rounded-full bg-[#F7A534] px-2 py-[2px] text-xs font-semibold text-white">
                  추천
                </span>
              )}

              {tab === 'all' && statusLabel && (
                <span
                  className={`rounded-full px-2 py-[2px] text-xs font-semibold text-white ${statusClass}`}
                >
                  {statusLabel}
                </span>
              )}
            </div>
            {/* 기술 매칭률 */}
            <div className="mb-3">
              <div className="mb-3 flex items-center gap-4">
                <div className="text-m font-medium text-[#413F3F]">
                  {tab === 'recommended' ? '추천 매칭률' : '기술 매칭률'}
                </div>
                <div className="text-2xl font-semibold text-[#DE4F36]">{rateLabel}</div>
              </div>
              <div className="h-2 w-64 rounded-full bg-[#E3DBDB]">
                <div
                  className="h-2 rounded-full bg-[#DE4F36] transition-all"
                  style={{ width: `${numericRate}%` }}
                />
              </div>
            </div>

            {/* 이력서 요약 */}
            {resume.summary && (
              <div className="mt-4">
                <div className="text-m mb-1 font-medium text-[#413F3F]">지원자 이력서 요약</div>
                <p className="text-sm leading-relaxed whitespace-pre-line text-[#837C7C]">
                  {resume.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 북마크 버튼 */}
      <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
        <button onClick={handleBookmark} className="rounded-full transition">
          <img src={checked ? fullHeartImg : emptyHeartImg} alt="heart" className="h-5 w-5" />
        </button>
      </div>

      {/* 보류 / 면접초대 */}
      <div className="absolute right-6 bottom-6 flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onInvite();
          }}
          className="rounded-full bg-[#DE4F36] px-4 py-2 font-medium text-white transition hover:bg-[#b73d2b]"
        >
          면접 초대
        </button>
      </div>
    </div>
  );
}
