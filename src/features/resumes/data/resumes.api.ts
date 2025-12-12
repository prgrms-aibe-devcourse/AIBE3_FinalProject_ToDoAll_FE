// src/features/resumes/data/resumes.api.ts
/* global HeadersInit */

import type { ResumeData } from '../types/resumes.types';
import { convertToBackendRequest } from './resumes.mapper';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');

// 인증 헤더 가져오기
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ---------------------------------------
// CREATE RESUME (multipart/form-data)
// ---------------------------------------
export async function createResume(resume: ResumeData) {
  // 1) 백엔드 DTO 형태로 변환
  const dto = convertToBackendRequest(resume);

  // 디버깅: activities 확인
  console.log('[createResume] activities:', JSON.stringify(dto.activities, null, 2));
  console.log('[createResume] certifications:', JSON.stringify(dto.certifications, null, 2));
  console.log('[createResume] resume.activities 원본:', resume.activities);

  // 2) FormData 생성
  const form = new FormData();

  // ✅ 2-1) DTO 전체를 JSON으로 묶어서 "data"라는 파트로 전송
  // undefined 값은 제거하기 위해 replacer 사용
  form.append(
    'data',
    new Blob(
      [
        JSON.stringify(dto, (value) => {
          // undefined 값은 제거 (null은 유지)
          return value === undefined ? undefined : value;
        }),
      ],
      { type: 'application/json' }
    )
  );
  // (환경에 따라) 아래처럼 해도 동작 가능
  // form.append('data', JSON.stringify(dto));

  // ✅ 2-2) 파일 파트 그대로 추가
  if (resume.files.resume instanceof File) {
    form.append('resumeFile', resume.files.resume);
  }
  if (resume.files.portfolio instanceof File) {
    form.append('portfolioFile', resume.files.portfolio);
  }

  const res = await fetch(`${BASE_URL}/api/v1/resumes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: form,
    credentials: 'include',
  });

  const text = await res.text();
  let response: any;
  try {
    response = JSON.parse(text);
  } catch {
    response = { message: text };
  }

  if (!res.ok) {
    throw new Error(response?.message || '이력서 제출 실패');
  }

  return response.data;
}

// ---------------------------------------
// GET RESUME
// ---------------------------------------
export async function getResume(resumeId: string): Promise<ResumeData> {
  const res = await fetch(`${BASE_URL}/api/v1/resumes/${resumeId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || '이력서 조회 실패');
  }

  const data = response.data;

  const resume: ResumeData = {
    id: String(data.id),
    jdId: data.jobId,
    name: data.name,
    gender: data.gender,
    birth: data.birthDate,

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
      data.education?.map((edu: any) => {
        // 백엔드 Enum → 프론트엔드 표시값 변환
        let type: string;
        switch (edu.educationLevel) {
          case 'ELEMENTARY':
            type = '초등학교';
            break;
          case 'MIDDLE':
            type = '중학교';
            break;
          case 'HIGH':
            type = '고등학교';
            break;
          case 'UNIVERSITY_ABOVE':
            type = '대학'; // 대학원도 UNIVERSITY_ABOVE로 오므로 기본값은 '대학'
            break;
          default:
            type = edu.educationLevel || '대학';
        }

        return {
          type,
          universityType: '',
          name: edu.schoolName,
          transferred: false,
          major: edu.major,
          graduated: edu.isGraduated,
          startDate: edu.admissionDate,
          endDate: edu.graduationDate,
          dayTime: edu.attendanceType as 'DAY' | 'NIGHT',
          gpa: edu.gpa,
          maxGpa: edu.gpaScale,
        };
      }) || [],

    career:
      data.experience?.map((exp: any) => ({
        company: exp.companyName,
        department: exp.department,
        position: exp.position,
        startDate: exp.startDate,
        endDate: exp.endDate,
        job: '',
      })) || [],

    experience:
      data.experience
        ?.map(
          (exp: any) => `${exp.companyName} (${exp.startDate} ~ ${exp.endDate}, ${exp.position})`
        )
        .join(', ') || '',

    activities:
      data.activities
        ?.map((act: any) => {
          // 백엔드 Enum → 프론트엔드 표시값 변환
          let frontendType: string;
          switch (act.type) {
            case 'ACTIVITY':
              frontendType = '활동';
              break;
            case 'EDUCATION':
              frontendType = '교육';
              break;
            case 'PROJECT':
              frontendType = '경험';
              break;
            default:
              frontendType = '활동';
          }

          // 프론트엔드 형식: "타입:제목:기관"
          const org = act.organization ? `:${act.organization}` : '';
          return `${frontendType}:${act.title}${org}`;
        })
        .join(',') || '',

    certifications:
      data.certifications
        ?.map((cert: any) => {
          // 백엔드 Enum → 프론트엔드 표시값 변환
          let frontendType: string;
          switch (cert.type) {
            case 'LICENSE':
              frontendType = '자격';
              break;
            case 'LANGUAGE':
              frontendType = '어학';
              break;
            case 'AWARD':
              frontendType = '수상';
              break;
            default:
              frontendType = '자격';
          }

          // 프론트엔드 형식: "타입:이름:점수"
          const score = cert.scoreOrLevel ? `:${cert.scoreOrLevel}` : '';
          return `${frontendType}:${cert.name}${score}`;
        })
        .join(',') || '',

    skills:
      data.skills?.map((skill: any) => {
        // 백엔드 Enum → 프론트엔드 표시값 변환
        let level: '초급' | '중급' | '고급';
        switch (skill.proficiencyLevel) {
          case 'BEGINNER':
            level = '초급';
            break;
          case 'INTERMEDIATE':
            level = '중급';
            break;
          case 'EXPERT':
            level = '고급';
            break;
          default:
            level = '초급';
        }

        return {
          name: skill.skillName,
          level,
        };
      }) || [],

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

// ---------------------------------------
// UPDATE MEMO
// ---------------------------------------
export async function updateResumeMemo(resumeId: string, memo: string) {
  const res = await fetch(`${BASE_URL}/api/v1/resumes/${resumeId}/memo`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify({ memo }),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || '메모 저장 실패');
  }

  return response.data;
}

// ---------------------------------------
// DELETE RESUME
// ---------------------------------------
export async function deleteResume(resumeId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/v1/resumes/${resumeId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || '이력서 삭제 실패');
  }
}

// ---------------------------------------
// UPDATE RESUME STATUS
// ---------------------------------------
export async function updateResumeStatus(
  resumeId: string,
  status: 'NEW' | 'BOOKMARK' | 'HOLD' | 'REJECT' | string
) {
  const res = await fetch(`${BASE_URL}/api/v1/resumes/${resumeId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
    body: JSON.stringify({ resumeStatus: status }),
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || '이력서 상태 수정 실패');
  }

  return response.data;
}

// ---------------------------------------
// GET RESUME INTERVIEW INFO
// ---------------------------------------
export async function getResumeInterviewInfo(resumeId: string) {
  const res = await fetch(`${BASE_URL}/api/v1/resumes/${resumeId}/interview-info`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    credentials: 'include',
  });

  const response = await res.json();

  if (!res.ok) {
    throw new Error(response.message || '인터뷰 정보 조회 실패');
  }

  return response.data;
}

// ---------------------------------------
// GET DOWNLOAD URL (Presigned URL)
// ---------------------------------------
export async function getDownloadUrl(fileKey: string): Promise<string> {
  const res = await fetch(
    `${BASE_URL}/api/v1/files/download?fileKey=${encodeURIComponent(fileKey)}`,
    {
      headers: getAuthHeaders(),
      credentials: 'include',
    }
  );

  const response = await res.json();
  if (!res.ok) throw new Error(response.message || '다운로드 URL 발급 실패');
  return response.data;
}
