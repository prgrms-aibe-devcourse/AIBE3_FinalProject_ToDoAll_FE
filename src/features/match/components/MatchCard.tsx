import type { MatchCardData } from '../types/matchCardData.types';
import { userDefaultImage } from '@/const.ts';
import cn from '@lib/utils/cn.ts';

type Props = {
  resume: MatchCardData;
  matchRate: number;
  tab: 'recommended' | 'all';
  onView: () => void;
  onInvite: () => void;
};

export default function MatchCard({ resume, matchRate, tab, onView, onInvite }: Props) {
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
      className="relative mx-auto flex w-full cursor-pointer flex-col items-end rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg"
      onClick={onView}
    >
      <div className="xs:flex-row flex w-full flex-col items-start gap-4">
        <img
          src={resume.profileImage || userDefaultImage}
          alt={resume.name}
          className="h-24 w-24 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = userDefaultImage;
          }}
        />

        <div className="flex w-full flex-col justify-between">
          <div className="mb-1 flex items-center gap-2">
            <h2 className="text-[24px] font-semibold text-[#413F3F]">{resume.name}</h2>

            {tab === 'recommended' && (
              <span className="rounded-full bg-[#F7A534] px-2 py-[2px] text-xs font-semibold text-white">
                추천
              </span>
            )}

            {tab === 'all' && statusLabel && (
              <span
                className={cn(
                  'rounded-full px-2 py-[2px] text-xs font-semibold whitespace-nowrap text-white',
                  statusClass
                )}
              >
                {statusLabel}
              </span>
            )}
          </div>
          <div className="mb-3">
            <div className="mb-3 flex items-center gap-4">
              <div className="text-m font-medium text-[#413F3F]">
                {tab === 'recommended' ? '추천 매칭률' : '기술 매칭률'}
              </div>
              <div className="text-2xl font-semibold text-[#DE4F36]">{rateLabel}</div>
            </div>
            <div className="h-2 w-full max-w-64 rounded-full bg-[#E3DBDB]">
              <div
                className="h-2 rounded-full bg-[#DE4F36] transition-all"
                style={{ width: `${numericRate}%` }}
              />
            </div>

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

      {/* 보류 / 면접초대 */}
      <div className="flex gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (resume.status == 'CONFIRMED') return;
            onInvite();
          }}
          className={cn(
            'bg-jd-gray-light rounded-full px-4 py-2 font-medium text-white transition',
            resume.status != 'CONFIRMED' && 'cursor-pointer bg-[#DE4F36] hover:bg-[#b73d2b]'
          )}
        >
          면접 초대
        </button>
      </div>
    </div>
  );
}
