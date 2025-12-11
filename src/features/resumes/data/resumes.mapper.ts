// src/features/resumes/data/resumes.mapper.ts
import type { ResumeData } from '../types/resumes.types';

export function convertToBackendRequest(resume: ResumeData) {
  return {
    name: resume.name,
    jobDescriptionId: resume.jdId,
    gender: resume.gender,
    birthDate: resume.birth,

    email: resume.email,
    phone: resume.phone,

    address: resume.address.detail,
    detailAddress: resume.address.city,

    // JSON 배열로 전달해야 함
    education: resume.education.map((e) => ({
      educationLevel: e.type,
      schoolName: e.name,
      major: e.major ?? '',
      isGraduated: Boolean(e.graduated),
      admissionDate: e.startDate || null,
      graduationDate: e.endDate || null,
      attendanceType: e.dayTime || 'DAY',
      gpa: e.gpa ? Number(e.gpa) : 0,
      gpaScale: e.maxGpa ? Number(e.maxGpa) : 0,
    })),

    experience: resume.career.map((c) => ({
      companyName: c.company,
      department: c.department,
      position: c.position,
      startDate: c.startDate,
      endDate: c.endDate,
    })),

    skills: resume.skills.map((s) => ({
      skillName: s.name,
      proficiencyLevel:
        s.level === '초급' ? 'BEGINNER' : s.level === '중급' ? 'INTERMEDIATE' : 'ADVANCED',
    })),

    activities: resume.activities
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length)
      .map((v) => ({
        title: v,
        type: 'ACTIVITY',
        organization: '',
      })),

    certifications: resume.certifications
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length)
      .map((v) => ({
        name: v,
        type: 'LICENSE',
        scoreOrLevel: '',
      })),

    // 🔥 파일 키 (기존 파일이 있고 새 파일을 업로드하지 않는 경우에만 전송)
    // 새 파일을 업로드하면 백엔드에서 S3에 업로드하고 새 키를 생성하므로 불필요
    resumeFileUrl: resume.files.resumeKey || '',
    portfolioFileUrl: resume.files.portfolioKey || '',
  };
}
