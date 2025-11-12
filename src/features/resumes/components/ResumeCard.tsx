import type { ResumeData } from '../types/resumes.types';
import emptyHeartImg from '../../../assets/Favorite-2.png';
import fullHeartImg from '../../../assets/Heart.png';
import { useState } from 'react';

type Props = {
  resume: ResumeData;
  matchRate?: number;
  onView?: () => void;
  onInvite?: () => void;
};

export default function ResumeCard({ resume, matchRate = 50, onView }: Props) {
  const [checked, setChecked] = useState(false);

  const handleClick = () => {
    setChecked(!checked);
    onView?.();
  };

  return (
    <div className="relative w-full flex mx-auto bg-white shadow-md rounded-2xl p-6 flex hover:shadow-lg transition">
      <div className="flex items-start gap-4 w-full pr-[160px]">
        <img
          src={resume.profileImage || '/default-profile.png'}
          alt={resume.name}
          className="w-24 h-24 rounded-full object-cover"
        />

        <div className="flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-[24px] text-[#413F3F]">{resume.name}</h2>
              <span className="bg-[#F7A534] text-white font-semibold text-xs px-2 py-[2px] rounded-full">
                추천
              </span>
            </div>

            <p className="text-[#837C7C] mb-3">{resume.experience}</p>

            <div className="items-center gap-4 mb-3">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-m text-[#413F3F] font-medium">기술 매칭률</div>
                <div className="px-[120px] text-2xl font-semibold text-[#DE4F36]">{matchRate}%</div>
              </div>
              <div className="w-64 bg-[#E3DBDB] h-2 rounded-full">
                <div
                  className="h-2 bg-[#DE4F36] rounded-full transition-all"
                  style={{ width: `${matchRate}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {resume.skills.map((skill) => (
                <span
                  key={skill.name}
                  className="text-xs bg-white border rounded-full px-2 py-1 text-[#837C7C] border-[#837C7C]"
                >
                  {skill.name}
                </span>
              ))}
            </div>

            {resume.career && resume.career.length > 0 && (
              <ul className="text-sm text-[#837C7C] list-disc list-inside mb-4">
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
          <img src={checked ? fullHeartImg : emptyHeartImg} alt="heart" className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-6 right-6 flex gap-2">
        <button
          onClick={handleClick}
          className="rounded-full bg-[#752F6D] text-[#FAF8F8] px-4 py-2 font-medium transition hover:bg-[#9A3F90]"
        >
          보류
        </button>
        <button
          onClick={handleClick}
          className="rounded-full bg-[#752F6D] text-[#FAF8F8] px-4 py-2 font-medium transition hover:bg-[#9A3F90]"
        >
          면접 초대
        </button>
      </div>
    </div>
  );
}
