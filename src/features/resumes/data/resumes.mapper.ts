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

    education: resume.education.map((e) => {
      let educationLevel: 'ELEMENTARY' | 'MIDDLE' | 'HIGH' | 'UNIVERSITY_ABOVE';
      if (e.type === '초등학교') educationLevel = 'ELEMENTARY';
      else if (e.type === '중학교') educationLevel = 'MIDDLE';
      else if (e.type === '고등학교') educationLevel = 'HIGH';
      else if (e.type === '대학' || e.type === '대학원') educationLevel = 'UNIVERSITY_ABOVE';
      else educationLevel = 'UNIVERSITY_ABOVE';

      const gpa = e.gpa && Number(e.gpa) > 0 ? Number(e.gpa) : 1.0;
      const gpaScale = e.maxGpa && Number(e.maxGpa) > 0 ? Number(e.maxGpa) : 4.5;

      return {
        educationLevel,
        schoolName: e.name,
        major: e.major ?? '',
        isGraduated: Boolean(e.graduated),
        admissionDate: e.startDate || null,
        graduationDate: e.endDate || null,
        attendanceType: (e.dayTime || 'DAY') as 'DAY' | 'NIGHT',
        gpa,
        gpaScale,
      };
    }),

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
        s.level === '초급' ? 'BEGINNER' : s.level === '중급' ? 'INTERMEDIATE' : 'EXPERT',
    })),

    activities:
      !resume.activities || resume.activities.trim().length === 0
        ? []
        : resume.activities
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v.length > 0)
            .map((v) => {
              const parts = v.split(':').map((p) => p.trim());
              let activityType: 'ACTIVITY' | 'EDUCATION' | 'PROJECT' = 'ACTIVITY';
              let title = '';
              let organization = '';

              if (parts.length >= 2) {
                const frontendType = parts[0];
                title = parts[1] || '';
                organization = parts[2] || '';

                if (frontendType === '활동') activityType = 'ACTIVITY';
                else if (frontendType === '교육') activityType = 'EDUCATION';
                else if (frontendType === '경험') activityType = 'PROJECT';
              } else {
                return null;
              }

              if (!title || title.trim().length === 0) {
                return null;
              }

              if (!organization || organization.trim().length === 0) {
                organization = '-';
              }

              return {
                title: title.trim(),
                type: activityType,
                organization: organization.trim(),
              };
            })
            .filter((act): act is NonNullable<typeof act> => act !== null), // null 항목 필터링

    certifications: (resume.certifications || '')
      .split(',')
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
      .map((v) => {
        const parts = v.split(':');
        let certType: 'LICENSE' | 'LANGUAGE' | 'AWARD' = 'LICENSE';
        let name = v;
        let scoreOrLevel: string | null = null;

        if (parts.length >= 2) {
          const frontendType = parts[0].trim();
          name = parts[1]?.trim() || '';

          if (frontendType === '자격') certType = 'LICENSE';
          else if (frontendType === '어학') certType = 'LANGUAGE';
          else if (frontendType === '수상') certType = 'AWARD';

          const scoreValue = parts[2]?.trim();
          if (scoreValue && scoreValue.length > 0) {
            const numValue = Number(scoreValue);
            if (!isNaN(numValue) && numValue > 0) {
              scoreOrLevel = scoreValue;
            }
          }
        }

        if (!name || name.trim().length === 0) {
          return null;
        }

        return {
          name: name.trim(),
          type: certType,

          scoreOrLevel: scoreOrLevel || null,
        };
      })
      .filter((cert): cert is NonNullable<typeof cert> => cert !== null), // null 항목 필터링

    resumeFileUrl:
      resume.files.resume instanceof File ? undefined : resume.files.resumeKey || undefined,
    portfolioFileUrl:
      resume.files.portfolio instanceof File ? undefined : resume.files.portfolioKey || undefined,
  };
}
