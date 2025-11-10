interface ProfileCardProps {
  profileData: any;
  name?: string;
  avatar?: string;
}

export default function ProfileCard({ profileData, name, avatar }: ProfileCardProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-2xl p-5 flex flex-col text-left text-sm">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar || profileData.image}
          alt={name || profileData.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h2 className="text-sm text-jd-black">{name || profileData.name}</h2>
          <p className="text-xs text-jd-gray-dark">{profileData.title}</p>
        </div>
      </div>

      <div className="flex items-start text-[12px] text-jd-black mb-2 mt-1">
        <div className="flex flex-col basis-1/3">
          <span className="font-medium text-jd-gray-dark mb-0.5">일자</span>
          <span>{profileData.date}</span>
        </div>
        <div className="flex flex-col basis-1/3">
          <span className="font-medium text-jd-gray-dark mb-0.5">시간</span>
          <span>{profileData.time}</span>
        </div>
        <div className="flex flex-col basis-1/3">
          <span className="font-medium text-jd-gray-dark mb-0.5">면접관</span>
          <span>{profileData.interviewers.join(', ')}</span>
        </div>
      </div>

      <div className="mb-2">
        <p className="text-[12px] font-medium text-jd-gray-dark mb-1 mt-2">보유 스킬</p>
        <div className="flex gap-2 flex-wrap">
          {profileData.skills.map((skill: string) => (
            <span key={skill} className="px-2 py-0.5 text-jd-gray-dark rounded-full text-xs border">
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <p className="text-[12px] font-medium text-jd-gray-dark mb-1 mt-2">부족 스킬</p>
        <div className="flex gap-2 flex-wrap">
          {profileData.missingSkills.map((s: string) => (
            <span key={s} className="px-2 py-0.5 text-jd-gray-dark rounded-full text-xs border">
              {s}
            </span>
          ))}
        </div>
      </div>

      <ul className="list-disc pl-4 text-xs text-jd-gray-dark space-y-1 mt-2">
        {profileData.experiences.map((exp: string, i: number) => (
          <li key={i}>{exp}</li>
        ))}
      </ul>
    </div>
  );
}
