import type { ResumeData } from '../types/resumes.types';

type Props = {
  resume: ResumeData;
  matchRate?: number; // 매칭률 추가
  onView?: () => void; // "보기" 버튼 클릭 핸들러
  onInvite?: () => void; // "면접 초대" 클릭 핸들러
};

export default function ResumeCard({ resume, matchRate = 50, onView, onInvite }: Props) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex items-start justify-between hover:shadow-lg transition">
      {/* 왼쪽: 프로필 + 정보 */}
      <div className="flex items-start gap-4">
        {/* 프로필 이미지 */}
        <img
          src={resume.profileImage || '/default-profile.png'}
          alt={resume.name}
          className="w-24 h-24 rounded-full object-cover"
        />

        {/* 텍스트 정보 */}
        <div>
          {/* 이름 + 추천 태그 */}
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-semibold text-lg">{resume.name}</h2>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded">추천</span>
          </div>

          {/* 경력 or 자기소개 */}
          <p className="text-gray-600 mb-3">{resume.experience}</p>

          {/* 기술 매칭률 */}
          <div className="text-sm text-gray-500 mb-1">기술 매칭률</div>
          <div className="w-64 bg-gray-200 h-2 rounded-full mb-2">
            <div
              className="h-2 bg-red-400 rounded-full transition-all"
              style={{ width: `${matchRate}%` }}
            />
          </div>
          <div className="text-sm font-semibold text-red-500 mb-3">{matchRate}%</div>

          {/* 스킬 태그 */}
          <div className="flex flex-wrap gap-2 mb-3">
            {resume.skills.map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 border rounded-full px-2 py-1 text-gray-600"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* 경력 목록 */}
          {resume.career && resume.career.length > 0 && (
            <ul className="text-sm text-gray-600 list-disc list-inside">
              {resume.career.map((c, idx) => (
                <li key={idx}>
                  {c.company} / {c.position} / {c.department}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 오른쪽 버튼 영역 */}
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onView}
          className="border px-4 py-2 rounded-full text-sm text-[#5C1E78] hover:bg-[#5C1E78] hover:text-white transition"
        >
          📄 보기
        </button>
        <button
          onClick={onInvite}
          className="border px-4 py-2 rounded-full text-sm bg-[#5C1E78] text-white hover:bg-[#47155e] transition"
        >
          ✉️ 면접 초대
        </button>
      </div>
    </div>
  );
}
