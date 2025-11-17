// src/features/resumes/data/resume.mapper.ts

import type { ResumeData } from '../types/resumes.types';

export function convertToBackendRequest(form: ResumeData) {
  return {
    name: form.name,
    jobDescriptionId: 10,

    gender: form.gender === '남' ? 'M' : 'F',
    birthDate: form.birth,

    email: form.email,
    phone: form.phone,

    address: form.address.city,
    detailAddress: form.address.detail,

    resumeFileUrl: form.files.resume,
    portfolioFileUrl: form.files.portfolio,

    education: form.education.map((e) => ({
      educationLevel: 'UNIVERSITY_ABOVE',
      schoolName: e.name,
      major: '기타전공',
      isGraduated: e.graduated,
      admissionDate: e.startDate,
      graduationDate: e.endDate,
      attendanceType: 'FULL',
      gpa: (e as any).gpa ?? null,
      gpaScale: 4.5,
    })),

    experience:
      form.career?.map((c) => ({
        companyName: c.company,
        department: c.department,
        position: c.position,
        endDate: c.endDate,
      })) ?? [],

    skills: form.skills.map((s) => ({
      skillName: s.name,
      proficiencyLevel:
        s.level === '초급' ? 'BEGINNER' : s.level === '중급' ? 'INTERMEDIATE' : 'ADVANCED',
    })),

    activities:
      form.activities
        ?.split('\n')
        .filter((v) => v.trim() !== '')
        .map((t) => ({
          title: t,
          type: 'ETC',
          organization: '',
        })) ?? [],

    certifications:
      form.certifications
        ?.split('\n')
        .filter((v) => v.trim() !== '')
        .map((t) => ({
          type: 'ETC',
          name: t,
          scoreOrLevel: '',
        })) ?? [],
  };
}
