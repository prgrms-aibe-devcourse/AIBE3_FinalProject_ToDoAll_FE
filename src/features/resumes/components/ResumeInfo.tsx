import type { ResumeData, EducationItem, Skill } from '../types/resumes.types';
import { useEffect, useMemo, useState } from 'react';
import { getDownloadUrl } from '../data/resumes.api';

interface ResumeInfoProps {
  data: ResumeData;
}

export default function ResumeInfo({ data }: ResumeInfoProps) {
  const portfolioLabel = useMemo(() => {
    const f = data.files?.portfolio;
    if (f && typeof f === 'object' && 'name' in f) return (f as File).name;
    return data.files?.portfolioName || data.files?.portfolioKey || '';
  }, [data]);

  const [profileHref, setProfileHref] = useState<string>('');
  const [_resumeHref, setResumeHref] = useState<string>('');
  const [portfolioHref, setPortfolioHref] = useState<string>('');

  const [resumeObjectUrl, setResumeObjectUrl] = useState<string>('');
  const [portfolioObjectUrl, setPortfolioObjectUrl] = useState<string>('');

  useEffect(() => {
    let alive = true;

    async function load() {
      console.groupCollapsed('[ResumeInfo] load');
      console.groupEnd();

      if (alive) {
        setProfileHref('');
        setResumeHref('');
        setPortfolioHref('');
      }

      if (data.files?.resume && data.files.resume instanceof File) {
        const objUrl = URL.createObjectURL(data.files.resume);
        console.log('[ResumeInfo] Created resume objectURL:', objUrl);
        if (!alive) return;
        setResumeObjectUrl(objUrl);
        setProfileHref(objUrl);
        setResumeHref(objUrl);
      } else if (data.files?.resumeKey) {
        try {
          const url = await getDownloadUrl(data.files.resumeKey);
          if (!alive) return;
          setProfileHref(url);
          setResumeHref(url);
        } catch (e) {
          console.error('[ResumeInfo] resumeKey presigned failed:', e);
          if (!alive) return;
          setProfileHref('');
          setResumeHref('');
        }
      } else {
        const p = data.profileImage || '';
        if (p) {
          if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) {
            if (!alive) return;
            setProfileHref(p);
          } else {
            try {
              const url = await getDownloadUrl(p);
              if (!alive) return;
              setProfileHref(url);
            } catch (e) {
              console.error('[ResumeInfo] profileImage presigned failed:', e);
              if (!alive) return;
              setProfileHref('');
            }
          }
        }
      }

      if (data.files?.portfolio && data.files.portfolio instanceof File) {
        const objUrl = URL.createObjectURL(data.files.portfolio);
        console.log('[ResumeInfo] Created portfolio objectURL:', objUrl);
        if (!alive) return;
        setPortfolioObjectUrl(objUrl);
        setPortfolioHref(objUrl);
      } else if (data.files?.portfolioKey) {
        try {
          const url = await getDownloadUrl(data.files.portfolioKey);
          if (!alive) return;
          setPortfolioHref(url);
        } catch (e) {
          console.error('[ResumeInfo] portfolioKey presigned failed:', e);
          if (!alive) return;
          setPortfolioHref('');
        }
      } else {
        if (!alive) return;
        setPortfolioHref('');
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [
    data.files?.resume,
    data.files?.resumeKey,
    data.files?.portfolio,
    data.files?.portfolioKey,
    data.profileImage,
  ]);

  useEffect(() => {
    return () => {
      if (resumeObjectUrl) {
        console.log('[ResumeInfo] Cleaning up resume objectURL');
        URL.revokeObjectURL(resumeObjectUrl);
      }
      if (portfolioObjectUrl) {
        console.log('[ResumeInfo] Cleaning up portfolio objectURL');
        URL.revokeObjectURL(portfolioObjectUrl);
      }
    };
  }, [resumeObjectUrl, portfolioObjectUrl]);

  return (
    <div>
      <h2 className="text-[30px] font-semibold text-[#413F3F]">지원서</h2>

      <div className="relative rounded-2xl bg-white p-6 shadow">
        <section className="mb-4 flex flex-wrap items-center justify-between">
          <section className="mb-4 flex flex-col">
            <h2 className="font-regular text-[25px] text-[#413F3F]">{data.name}</h2>
            <p className="text-[18px] text-[#837C7C]">프론트엔드 개발자 지원</p>
          </section>
          <img
            src={profileHref || '/images/default-profile.jpg'}
            alt={`${data.name} 프로필`}
            className="h-48 w-36 rounded-[10px] object-cover shadow-md"
            onError={(e) => {
              console.error('[PROFILE] load fail:', profileHref, e);
              console.error('[PROFILE] files.resume:', data.files?.resume);
              console.error('[PROFILE] files.resumeKey:', data.files?.resumeKey);
              const target = e.target as HTMLImageElement;
              if (target.src !== '/images/default-profile.jpg') {
                target.src = '/images/default-profile.jpg';
              }
            }}
            onLoad={() =>
              console.log('[PROFILE] load ok:', profileHref || '/images/default-profile.jpg')
            }
          />
        </section>

        {/* 기본 정보 */}
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

        {/* 파일 */}
        <section className="mt-6 flex flex-row gap-2">
          <div className="flex-1 rounded-[10px] border border-[#E3DBDB] p-5">
            <h2 className="font-semibold text-[#413F3F]">포트폴리오</h2>
            {portfolioLabel ? (
              portfolioHref ? (
                <a
                  href={portfolioHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-light text-[#413F3F] hover:text-[#2E2C2C] hover:underline"
                >
                  {portfolioLabel}
                </a>
              ) : (
                <span className="font-light text-[#413F3F]">{portfolioLabel}</span>
              )
            ) : (
              <p className="text-sm text-[#837C7C]">포트폴리오가 없습니다.</p>
            )}
          </div>
        </section>

        {/* 학력사항 */}
        <section className="mt-6">
          <h3 className="mb-3 border-y border-[#837C7C] bg-[#FAF8F8] px-3 py-2 font-semibold text-[#413F3F]">
            학력사항
          </h3>
          {data.education.length > 0 ? (
            <div className="space-y-2 px-3">
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
            <p className="px-3 text-sm text-[#837C7C]">학력사항이 없습니다.</p>
          )}
        </section>

        {/* 경력 */}
        <section className="mt-4">
          <h3 className="mb-3 border-y border-[#837C7C] bg-[#FAF8F8] px-3 py-2 font-semibold text-[#413F3F]">
            경력
          </h3>
          {data.career && data.career.length > 0 ? (
            <div className="space-y-2 px-3">
              {data.career.map((career, idx) => (
                <div key={idx}>
                  <p>
                    {career.company} {career.department && `- ${career.department}`} (
                    {career.startDate} ~ {career.endDate}) {career.position}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-3 text-sm text-[#837C7C]">경력이 없습니다.</p>
          )}
        </section>

        {/* 스킬 */}
        <section className="mt-4">
          <h3 className="mb-3 border-y border-[#837C7C] bg-[#FAF8F8] px-3 py-2 font-semibold text-[#413F3F]">
            스킬
          </h3>
          {data.skills.length > 0 ? (
            <ul className="flex flex-wrap gap-2 px-3">
              {data.skills.map((skill: Skill, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-1 text-gray-700"
                >
                  <span>{skill.name}</span>
                  <span className="text-xs text-gray-500">({skill.level})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 text-sm text-[#837C7C]">스킬이 없습니다.</p>
          )}
        </section>

        {/* 경험/활동/교육 */}
        <section className="mt-4">
          <h3 className="mb-3 border-y border-[#837C7C] bg-[#FAF8F8] px-3 py-2 font-semibold text-[#413F3F]">
            경험/활동/교육
          </h3>
          {data.activities ? (
            <p className="px-3">{data.activities}</p>
          ) : (
            <p className="px-3 text-sm text-[#837C7C]">경험/활동/교육 내역이 없습니다.</p>
          )}
        </section>

        {/* 자격/어학/수상 */}
        <section className="mt-4">
          <h3 className="mb-3 border-y border-[#837C7C] bg-[#FAF8F8] px-3 py-2 font-semibold text-[#413F3F]">
            자격/어학/수상
          </h3>
          {data.certifications ? (
            <p className="px-3">{data.certifications}</p>
          ) : (
            <p className="px-3 text-sm text-[#837C7C]">자격/어학/수상 내역이 없습니다.</p>
          )}
        </section>
      </div>
    </div>
  );
}
