import type { ResumeData, EducationItem } from '../types/resumes.types';

interface ResumeInfoProps {
  data: ResumeData;
}

export default function ResumeInfo({ data }: ResumeInfoProps) {
  return (
    <div>
      <h2 className="font-semibold text-[30px] text-[#413F3F]">지원서</h2>
      <div className="relative bg-white rounded-2xl shadow p-6">
        <img
          src={data.profileImage}
          alt={`${data.name} 프로필`}
          className="absolute top-6 right-6 w-36 h-48 rounded-[10px] object-cover shadow-md"
        />

        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[25px] font-regular text-[#413F3F]">{data.name}</h2>
            <p className="text-[#837C7C] text-[18px]">프론트엔드 개발자 지원</p>
          </div>
        </header>

        <div className="space-y-6 text-sm font-medium text-[#413F3F]">
          <div>
            <b>이메일:</b> {data.email}
          </div>
          <div>
            <b>연락처:</b> {data.phone}
          </div>
          <div>
            <b>접수일:</b> {data.applyDate}
          </div>
          <div>
            <b>생년월일:</b> {data.birth}
          </div>
          <div>
            <b>주소:</b> {`${data.address.country} ${data.address.city} ${data.address.detail}`}
          </div>
          <div>
            <b>성별:</b> {data.gender}
          </div>
        </div>

        <section className="mt-6 flex flex-row gap-2">
          <div className="border border-[#E3DBDB] rounded-[10px] p-5 flex-1">
            <h2 className="font-semibold text-[#413F3F]">자기소개서</h2>
            {data.files.resume ? (
              <a
                href="#"
                className="text-[#413F3F] font-light hover:text-[#2E2C2C] hover:underline"
              >
                {data.files.resume}
              </a>
            ) : (
              <p className="text-[#837C7C] text-sm">자기소개서가 없습니다.</p>
            )}
          </div>

          <div className="border border-[#E3DBDB] rounded-[10px] p-5 flex-1">
            <h2 className="font-semibold text-[#413F3F]">포트폴리오</h2>
            {data.files.portfolio ? (
              <a
                href="#"
                className="text-[#413F3F] font-light hover:text-[#2E2C2C] hover:underline"
              >
                {data.files.portfolio}
              </a>
            ) : (
              <p className="text-[#837C7C] text-sm">포트폴리오가 없습니다.</p>
            )}
          </div>
        </section>

        <section className="mt-6">
          <h3 className="font-semibold text-[#413F3F] bg-[#FAF8F8] border-y border-[#837C7C] py-2 px-3 mb-3">
            학력사항
          </h3>
          {data.education.length > 0 ? (
            <div className="px-3 space-y-2">
              {data.education.map((edu: EducationItem, idx) => {
                const isUniversity = edu.type === '대학' || edu.type === '대학원';
                return (
                  <div key={idx}>
                    {isUniversity ? (
                      <p>
                        [{edu.type}] {edu.universityType} {edu.name} ({edu.startDate} ~{' '}
                        {edu.endDate}) {edu.transferred ? '편입' : ''} 전공: {edu.major}{' '}
                        {edu.dayTime} {edu.graduated ? '졸업' : '재학중'}{' '}
                        {edu.gpa ? `GPA: ${edu.gpa}` : ''}
                      </p>
                    ) : (
                      <p>
                        [{edu.type}] {edu.name} ({edu.startDate} ~ {edu.endDate}){' '}
                        {edu.graduated ? '졸업' : '재학중'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="px-3 text-[#837C7C] text-sm">학력사항이 없습니다.</p>
          )}
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-[#413F3F] bg-[#FAF8F8] border-y border-[#837C7C] py-2 px-3 mb-3">
            경력사항
          </h3>
          {data.experience ? (
            <p className="px-3">{data.experience}</p>
          ) : (
            <p className="px-3 text-[#837C7C] text-sm">경력사항이 없습니다.</p>
          )}
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-[#413F3F] bg-[#FAF8F8] border-y border-[#837C7C] py-2 px-3 mb-3">
            스킬
          </h3>
          {data.skills.length > 0 ? (
            <ul className="flex flex-wrap gap-2 px-3">
              {data.skills.map((skill) => (
                <li key={skill} className="px-3 py-1 bg-gray-100 rounded-lg text-gray-700">
                  {skill}
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 text-[#837C7C] text-sm">스킬이 없습니다.</p>
          )}
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-[#413F3F] bg-[#FAF8F8] border-y border-[#837C7C] py-2 px-3 mb-3">
            경험/활동/교육
          </h3>
          {data.activities ? (
            <p className="px-3">{data.activities}</p>
          ) : (
            <p className="px-3 text-[#837C7C] text-sm">경험/활동/교육 내역이 없습니다.</p>
          )}
        </section>

        <section className="mt-4">
          <h3 className="font-semibold text-[#413F3F] bg-[#FAF8F8] border-y border-[#837C7C] py-2 px-3 mb-3">
            자격/어학/수상
          </h3>
          {data.certifications ? (
            <p className="px-3">{data.certifications}</p>
          ) : (
            <p className="px-3 text-[#837C7C] text-sm">자격/어학/수상 내역이 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
}
