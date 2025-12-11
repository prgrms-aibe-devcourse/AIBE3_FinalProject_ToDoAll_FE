// src/features/resumes/data/resumes.api.ts
import type { ResumeData } from '../types/resumes.types';
import { convertToBackendRequest } from './resumes.mapper';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

export async function createResume(resume: ResumeData) {
  const requestBody = convertToBackendRequest(resume);

  const form = new FormData();
  form.append('data', new Blob([JSON.stringify(requestBody)], { type: 'application/json' }));

  // 프로필 이미지는 resumeFile로 전송 (BasicInfoForm에서 files.resume에 저장됨)
  if (resume.files.resume) {
    if (resume.files.resume instanceof File) {
      form.append('resumeFile', resume.files.resume);
      console.log(
        '[CREATE RESUME] resumeFile 추가됨:',
        resume.files.resume.name,
        resume.files.resume.type,
        resume.files.resume.size
      );
    } else {
      console.warn(
        '[CREATE RESUME] resume.files.resume이 File 객체가 아닙니다:',
        resume.files.resume
      );
    }
  } else {
    console.warn('[CREATE RESUME] resumeFile이 없습니다!');
  }

  if (resume.files.portfolio) {
    if (resume.files.portfolio instanceof File) {
      form.append('portfolioFile', resume.files.portfolio);
      console.log(
        '[CREATE RESUME] portfolioFile 추가됨:',
        resume.files.portfolio.name,
        resume.files.portfolio.type,
        resume.files.portfolio.size
      );
    } else {
      console.warn(
        '[CREATE RESUME] resume.files.portfolio가 File 객체가 아닙니다:',
        resume.files.portfolio
      );
    }
  } else {
    console.warn('[CREATE RESUME] portfolioFile이 없습니다!');
  }

  // ✅ 디버그(요청 전에 파일이 붙었는지 확정)
  console.log('[CREATE RESUME] resume file:', resume.files.resume);
  console.log('[CREATE RESUME] portfolio file:', resume.files.portfolio);
  console.log('[CREATE RESUME] profileImage:', resume.profileImage);
  console.log('[CREATE RESUME] form.has(resumeFile)=', form.has('resumeFile'));
  console.log('[CREATE RESUME] form.has(portfolioFile)=', form.has('portfolioFile'));

  for (const [k, v] of form.entries()) {
    if (typeof v === 'string') {
      console.log(`[CREATE RESUME] [form] ${k}:`, v.substring(0, 100) + '...');
    } else {
      // Blob/File
      console.log(`[CREATE RESUME] [form] ${k}: Blob(type=${v.type}, size=${v.size})`);
      if ('name' in v) console.log(`[CREATE RESUME] [form] ${k} filename:`, (v as File).name);
    }
  }

  const res = await fetch(`${BASE_URL}/api/v1/resumes`, {
    method: 'POST',
    body: form,
    credentials: 'include',
  });

  const text = await res.text();
  console.log('status', res.status);
  console.log('raw response', text);

  let response: any = {};
  try {
    response = JSON.parse(text);
  } catch {
    // JSON 파싱 실패 시 빈 객체 사용
  }

  if (!res.ok) throw new Error(response?.message || text || '이력서 제출 실패');
  return response.data;
}

export async function getResume(resumeId: string): Promise<ResumeData> {
  const res = await fetch(`${BASE_URL}/api/v1/resumes/${resumeId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const response = await res.json();

  if (response.message !== 'success') {
    throw new Error(response.message || '이력서 조회 실패');
  }

  const data = response.data;

  const resume: ResumeData = {
    id: String(data.id),
    jdId: data.jobId,
    name: data.name,
    gender: data.gender,
    birth: data.birthDate,
    // profileImage는 key이므로 presigned URL로 변환은 ResumeInfo에서 처리
    profileImage: data.resumeImage || data.profileImageUrl || data.profileImage || '',
    email: data.email,
    phone: data.phone,
    applyDate: data.applyDate || '',
    address: {
      country: data.address || '대한민국',
      city: data.detailAddress || '',
      detail: '',
    },

    education:
      data.education?.map((edu: any) => ({
        type: edu.educationLevel,
        universityType: '',
        name: edu.schoolName,
        transferred: false,
        major: edu.major,
        graduated: edu.isGraduated,
        startDate: edu.admissionDate,
        endDate: edu.graduationDate,
        dayTime: edu.attendanceType,
        gpa: edu.gpa,
      })) || [],

    career: [],

    experience:
      data.experience
        ?.map(
          (exp: any) => `${exp.companyName} (${exp.startDate} ~ ${exp.endDate}, ${exp.position})`
        )
        .join(', ') || '',

    activities:
      data.activities?.map((act: any) => `${act.title} (${act.organization})`).join(', ') || '',
    certifications:
      data.certifications
        ?.map((cert: any) => `${cert.name} (${cert.type}, ${cert.scoreOrLevel})`)
        .join(', ') || '',

    skills:
      data.skills?.map((skill: any) => ({
        name: skill.skillName,
        level: skill.proficiencyLevel,
      })) || [],

    files: {
      resume: null,
      portfolio: null,
      etc: [],

      resumeKey: data.resumeFileUrl || '',
      portfolioKey: data.portfolioFileUrl || '',

      resumeName: '',
      portfolioName: '',
      etcNames: [],
    },

    memo: data.memo || '',
  };

  return resume;
}

export async function updateResumeMemo(resumeId: string, memo: string) {
  const res = await fetch(`${BASE_URL}/api/v1/resumes/${resumeId}/memo`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ memo }),
  });

  const response = await res.json();

  if (response.errorCode !== 0) {
    throw new Error(response.message || '메모 저장 실패');
  }

  return response.data;
}

export async function getDownloadUrl(fileKey: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/v1/files/download?fileKey=${encodeURIComponent(fileKey)}`,
    { credentials: 'include' }
  );
  const response = await res.json();
  if (!res.ok) throw new Error(response.message || '다운로드 URL 발급 실패');
  return response.data;
}
