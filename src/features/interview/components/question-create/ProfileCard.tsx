import { Skeleton } from '@shared/components/Skeleton.tsx';
import type { ProfileData } from '@features/interview/pages/InterviewNotePage.tsx';

interface ProfileCardProps {
  profileData: ProfileData | null;
  name?: string;
  avatar?: string;
}

export default function ProfileCard({ profileData, name, avatar }: ProfileCardProps) {
  return (
    <div className="border-jd-gray-light flex min-w-xs flex-col rounded-2xl border bg-white p-5 text-left text-sm shadow-md">
      <div className="mb-3 flex items-center gap-3">
        {profileData ? (
          <img
            src={avatar || profileData.image}
            alt={name || profileData.name}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <Skeleton className="h-12 w-12 rounded-full object-cover" />
        )}

        <div>
          {profileData ? (
            <h2 className="text-jd-black text-sm">{profileData.name}</h2>
          ) : (
            <Skeleton className="text-jd-black h-[14px] w-[50px] text-sm" />
          )}

          {profileData ? (
            <p className="text-jd-gray-dark text-xs">{profileData.title}</p>
          ) : (
            <Skeleton className="text-jd-gray-dark h-[12px] w-[50px] text-xs" />
          )}
        </div>
      </div>

      <div className="text-jd-black mt-1 mb-2 flex items-start text-[12px]">
        <div className="flex basis-1/3 flex-col">
          <span className="text-jd-gray-dark mb-0.5 font-medium">일자</span>
          {profileData ? (
            <span>{profileData.date}</span>
          ) : (
            <Skeleton className="h-[12px] w-[50px]" />
          )}
        </div>
        <div className="flex basis-1/3 flex-col">
          <span className="text-jd-gray-dark mb-0.5 font-medium">시간</span>
          {profileData ? (
            <span>{profileData.time}</span>
          ) : (
            <Skeleton className="h-[12px] w-[50px]" />
          )}
        </div>
        <div className="flex basis-1/3 flex-col">
          <span className="text-jd-gray-dark mb-0.5 font-medium">면접관</span>
          {profileData ? (
            <span>{profileData.interviewers.join(', ')}</span>
          ) : (
            <Skeleton className="h-[12px] w-[50px]" />
          )}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-jd-gray-dark mt-2 mb-1 text-[12px] font-medium">보유 스킬</p>
        <div className="flex flex-wrap gap-2">
          {profileData ? (
            profileData.skills.map((skill: string) => (
              <span
                key={skill}
                className="text-jd-gray-dark rounded-full border px-2 py-0.5 text-xs"
              >
                {skill}
              </span>
            ))
          ) : (
            <Skeleton className="h-[22px] w-[50px]" />
          )}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-jd-gray-dark mt-2 mb-1 text-[12px] font-medium">부족 스킬</p>
        <div className="flex flex-wrap gap-2">
          {profileData ? (
            profileData.missingSkills.map((s: string) => (
              <span key={s} className="text-jd-gray-dark rounded-full border px-2 py-0.5 text-xs">
                {s}
              </span>
            ))
          ) : (
            <Skeleton className="h-[22px] w-[50px]" />
          )}
        </div>
      </div>

      <ul className="text-jd-gray-dark mt-2 list-disc space-y-1 pl-4 text-xs">
        {profileData
          ? profileData.experiences.map((exp: string, i: number) => <li key={i}>{exp}</li>)
          : null}
      </ul>
    </div>
  );
}
