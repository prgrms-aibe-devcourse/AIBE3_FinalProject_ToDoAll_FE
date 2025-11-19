import type { ResumeData } from '../../resumes/types/resumes.types';
import emptyHeartImg from '../../../assets/Favorite-2.png';
import fullHeartImg from '../../../assets/Heart.png';
import { useState } from 'react';

type Props = {
  resume: ResumeData;
  matchRate?: number;
  onView?: () => void;
  onInvite?: () => void;
};

export default function MatchCard({ resume, matchRate = 50, onView }: Props) {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
    onView?.();
  };

  return (
    <div className="relative mx-auto flex w-full rounded-2xl bg-white p-6 shadow-md transition hover:shadow-lg">
      <div className="flex w-full items-start gap-4 pr-[160px]">
        <img
          src={resume.profileImage || '/default-profile.png'}
          alt={resume.name}
          className="h-24 w-24 rounded-full object-cover"
        />

        <div className="flex w-full flex-col justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <h2 className="text-[24px] font-semibold text-[#413F3F]">{resume.name}</h2>
              <span className="rounded-full bg-[#F7A534] px-2 py-[2px] text-xs font-semibold text-white">
                추천
              </span>
            </div>

            <p className="mb-3 text-[#837C7C]">{resume.experience}</p>

            <div className="mb-3 items-center gap-4">
              <div className="mb-3 flex items-center gap-4">
                <div className="text-m font-medium text-[#413F3F]">기술 매칭률</div>
                <div className="px-[120px] text-2xl font-semibold text-[#DE4F36]">{matchRate}%</div>
              </div>
              <div className="h-2 w-64 rounded-full bg-[#E3DBDB]">
                <div
                  className="h-2 rounded-full bg-[#DE4F36] transition-all"
                  style={{ width: `${matchRate}%` }}
                />
              </div>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {resume.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-[#837C7C] bg-white px-2 py-1 text-xs text-[#837C7C]"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            {resume.career && resume.career.length > 0 && (
              <ul className="mb-4 list-inside list-disc text-sm text-[#837C7C]">
                {resume.career.map((c, idx) => (
                  <li key={idx}>
                    {c.company} / {c.position} / {c.department}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
        <button onClick={handleClick} className="rounded-full transition">
          <img src={checked ? fullHeartImg : emptyHeartImg} alt="heart" className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute right-6 bottom-6 flex gap-2">
        <button
          onClick={handleClick}
          className="rounded-full bg-[#752F6D] px-4 py-2 font-medium text-[#FAF8F8] transition hover:bg-[#9A3F90]"
        >
          보류
        </button>
        <button
          onClick={handleClick}
          className="rounded-full bg-[#752F6D] px-4 py-2 font-medium text-[#FAF8F8] transition hover:bg-[#9A3F90]"
        >
          면접 초대
        </button>
      </div>
    </div>
  );
}
