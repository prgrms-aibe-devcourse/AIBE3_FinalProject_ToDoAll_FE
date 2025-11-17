// src/features/resumes/data/resumes.api.ts
import type { ResumeData } from '../types/resumes.types';
import { convertToBackendRequest } from './resumes.mapper';

export async function createResume(resume: ResumeData) {
  const requestBody = convertToBackendRequest(resume);

  const res = await fetch('http://localhost:8080/api/v1/resumes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
    credentials: 'include',
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || '이력서 제출 실패');
  }

  return response.data;
}

export async function getResume(resumeId: string): Promise<ResumeData> {
  const res = await fetch(`http://localhost:8080/api/v1/resumes/${resumeId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });

  const response = await res.json();

  console.log('🔥 백엔드 응답:', response);

  // ✔ 실제 백엔드 응답(message: "success")에 맞는 체크
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
    profileImage: 'https://via.placeholder.com/150?text=Profile',
    email: data.email,
    phone: data.phone,
    applyDate: '',
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
      resume: data.resumeFileUrl || '',
      portfolio: data.portfolioFileUrl || '',
      etc: [],
    },
    memo: data.memo || '',
  };

  return resume;
}

export async function updateResumeMemo(resumeId: string, memo: string) {
  const res = await fetch(`http://localhost:8080/api/resumes/${resumeId}/memo`, {
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
