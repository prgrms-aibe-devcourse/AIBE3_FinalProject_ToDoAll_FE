import type { ResumeData } from '../types/resumes.types';

function mapProficiency(level: string) {
  if (level === '초급') return 'BEGINNER';
  if (level === '중급') return 'INTERMEDIATE';
  return 'EXPERT';
}

function mapActivityType() {
  return 'ACTIVITY';
}

function mapCertificationType() {
  return 'LICENSE';
}

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
      educationLevel:
        e.type === '초등학교'
          ? 'ELEMENTARY'
          : e.type === '중학교'
            ? 'MIDDLE'
            : e.type === '고등학교'
              ? 'HIGH'
              : 'UNIVERSITY_ABOVE',

      schoolName: e.name,
      major: e.type === '대학' || e.type === '대학원' ? e.major : null,
      isGraduated: e.graduated,
      admissionDate: e.startDate,
      graduationDate: e.endDate,

      attendanceType:
        e.type === '대학' || e.type === '대학원' ? (e.dayTime === 'DAY' ? 'DAY' : 'NIGHT') : null,

      gpa: e.type === '대학' || e.type === '대학원' ? (e.grade ?? null) : null,
      gpaScale: e.type === '대학' || e.type === '대학원' ? (e.maxGrade ?? null) : null,
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
      proficiencyLevel: mapProficiency(s.level),
    })),

    activities:
      form.activities
        ?.split('\n')
        .filter((v) => v.trim() !== '')
        .map((t) => ({
          title: t,
          type: mapActivityType(),
          organization: '',
        })) ?? [],

    certifications:
      form.certifications
        ?.split('\n')
        .filter((v) => v.trim() !== '')
        .map((t) => ({
          type: mapCertificationType(),
          name: t,
          scoreOrLevel: '',
        })) ?? [],
  };
}
