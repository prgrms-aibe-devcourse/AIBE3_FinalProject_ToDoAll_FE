interface ProfileCardProps {
  profileData: any;
  name?: string;
  avatar?: string;
}

export default function ProfileCard({ profileData, name, avatar }: ProfileCardProps) {
  return (
    <div className="border-jd-gray-light flex flex-col rounded-2xl border bg-white p-5 text-left text-sm shadow-md">
      <div className="mb-3 flex items-center gap-3">
        <img
          src={avatar || profileData.image}
          alt={name || profileData.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-jd-black text-sm">{name || profileData.name}</h2>
          <p className="text-jd-gray-dark text-xs">{profileData.title}</p>
        </div>
      </div>

      <div className="text-jd-black mt-1 mb-2 flex items-start text-[12px]">
        <div className="flex basis-1/3 flex-col">
          <span className="text-jd-gray-dark mb-0.5 font-medium">일자</span>
          <span>{profileData.date}</span>
        </div>
        <div className="flex basis-1/3 flex-col">
          <span className="text-jd-gray-dark mb-0.5 font-medium">시간</span>
          <span>{profileData.time}</span>
        </div>
        <div className="flex basis-1/3 flex-col">
          <span className="text-jd-gray-dark mb-0.5 font-medium">면접관</span>
          <span>{profileData.interviewers.join(', ')}</span>
        </div>
      </div>

      <div className="mb-2">
        <p className="text-jd-gray-dark mt-2 mb-1 text-[12px] font-medium">보유 스킬</p>
        <div className="flex flex-wrap gap-2">
          {profileData.skills.map((skill: string) => (
            <span key={skill} className="text-jd-gray-dark rounded-full border px-2 py-0.5 text-xs">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-jd-gray-dark mt-2 mb-1 text-[12px] font-medium">부족 스킬</p>
        <div className="flex flex-wrap gap-2">
          {profileData.missingSkills.map((s: string) => (
            <span key={s} className="text-jd-gray-dark rounded-full border px-2 py-0.5 text-xs">
              {s}
            </span>
          ))}
        </div>
      </div>

      <ul className="text-jd-gray-dark mt-2 list-disc space-y-1 pl-4 text-xs">
        {profileData.experiences.map((exp: string, i: number) => (
          <li key={i}>{exp}</li>
        ))}
      </ul>
    </div>
  );
}
