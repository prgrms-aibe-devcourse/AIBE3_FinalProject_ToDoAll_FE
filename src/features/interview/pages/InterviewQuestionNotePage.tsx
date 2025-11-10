// 프로필 데이터
const profileData = {
  name: '김철수',
  title: '프론트엔드 개발자',
  date: '2025-12-01',
  time: '12:00',
  interviewers: ['홍길동', '홍길순'],
  skills: ['Git', 'React'],
  missingSkills: ['TypeScript', 'Next.js'],
  experiences: [
    '7년 프론트엔드 개발 경험',
    'React와 Next.js 전문가',
    '대규모 전자상거래 플랫폼 개발 경험',
  ],
  image: 'https://cdn.pixabay.com/photo/2025/10/02/06/28/mood-9867715_1280.jpg',
};

// 질문 데이터
const questionData = [
  {
    title: '기술 및 아키텍처',
    questions: [
      'React에서 렌더링 최적화를 위해 어떤 방법들을 사용해보셨나요?',
      'Next.js의 SSR과 SSG의 차이를 실제 프로젝트에서 어떻게 활용하셨나요?',
      '대규모 전자상거래 플랫폼 개발 시 상태 관리를 어떤 방식으로 구성하셨나요?',
      'React 18의 Concurrent Rendering이나 Suspense for Data Fetching을 사용해보신 경험이 있으신가요?',
      'Next.js에서 Dynamic Routing과 Static Routing을 어떻게 설계하셨나요?',
    ],
  },
  {
    title: '성능 / 품질 / 운영 관련',
    questions: [
      '7년 동안의 프로젝트 경험 중, 성능 이슈 해결 사례를 설명해주세요.',
      '신규 기능 개발 시 코드 품질을 유지하기 위해 어떤 기준을 적용하셨나요?',
      '배포 자동화(CI/CD)나 테스트 자동화를 어떤 방식으로 구성하셨나요?',
    ],
  },
  {
    title: '협업 / 유지보수',
    questions: [
      '성능 개선을 위해 어떤 최적화 전략을 적용하셨나요?',
      'Core Web Vitals(LCP, FID, CLS) 개선을 위해 어떤 모니터링 도구를 사용했는지 설명해주세요.',
    ],
  },
];

export default function InterviewQuestionNotePage() {
  return (
    <div className="mx-auto p-8 min-h-screen bg-[#fbf9f9] font-sans">
      <h1 className="text-2xl font-bold mb-6">질문 노트</h1>

      <div className="flex gap-8">
        {/* 왼쪽 프로필 */}
        <div className="w-1/4">
          <div className="bg-white shadow rounded-2xl p-5 flex flex-col text-left text-sm border">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={profileData.image}
                alt={profileData.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-sm font-semibold">{profileData.name}</h2>
                <p className="text-xs text-gray-600">{profileData.title}</p>
              </div>
            </div>

            <div className="flex justify-between items-center text-[12px] text-gray-700 mb-3 border-gray-100 py-2">
              <div className="flex flex-col items-left flex-1">
                <span className="font-medium text-gray-500 mb-0.5">일자</span>
                <span>{profileData.date}</span>
              </div>
              <div className="flex flex-col items-left flex-1 border-gray-100 ">
                <span className="font-medium text-gray-500 mb-0.5">시간</span>
                <span>{profileData.time}</span>
              </div>
              <div className="flex flex-col items-left flex-1">
                <span className="font-medium text-gray-500 mb-0.5">면접관</span>
                <span>{profileData.interviewers.join(', ')}</span>
              </div>
            </div>

            <div className="mb-3">
              <p className="text-[12px] font-medium text-gray-500 mb-1">보유 스킬</p>
              <div className="flex gap-2 flex-wrap">
                {profileData.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-[12px] font-medium text-gray-500 mb-1">부족 스킬</p>
              <div className="flex gap-2 flex-wrap">
                {profileData.missingSkills.map((missingSkills) => (
                  <span
                    key={missingSkills}
                    className="px-2 py-0.5 bg-gray-100 rounded-full text-xs border"
                  >
                    {missingSkills}
                  </span>
                ))}
              </div>
            </div>

            <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1">
              {profileData.experiences.map((exp, i) => (
                <li key={i}>{exp}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 오른쪽 질문 박스 */}
        <div className="w-3/4">
          <div className="bg-white shadow rounded-2xl border p-8 text-sm leading-relaxed">
            {questionData.map((section) => (
              <div key={section.title} className="mb-6">
                <h3 className="font-semibold text-base mb-2">{section.title}</h3>
                <ul className="space-y-1 text-gray-800 list-disc pl-5">
                  {section.questions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* 수정 버튼 */}
          <div className="flex justify-end mt-8">
            <button className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 rounded-lg shadow">
              질문 수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
