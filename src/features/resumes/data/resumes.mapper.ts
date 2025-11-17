import type { ResumeData, EducationItem, Skill } from '../types/resumes.types';

function mapEducationLevel(type: EducationItem['type']) {
  switch (type) {
    case '초등학교':
      return 'ELEMENTARY';
    case '중학교':
      return 'MIDDLE';
    case '고등학교':
      return 'HIGH';
    default:
      return 'UNIVERSITY_ABOVE';
  }
}

function mapAttendanceType(dayTime?: 'DAY' | 'NIGHT') {
  return dayTime === 'NIGHT' ? 'NIGHT' : 'DAY';
}

function mapProficiencyLevel(level: Skill['level']) {
  switch (level) {
    case '초급':
      return 'BEGINNER';
    case '중급':
      return 'INTERMEDIATE';
    default:
      return 'EXPERT';
  }
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
    jobDescriptionId: form.jdId,
    gender: form.gender === '남' ? 'M' : 'F',
    birthDate: form.birth,
    email: form.email,
    phone: form.phone,
    address: form.address.city,
    detailAddress: form.address.detail,
    resumeFileUrl: form.files.resume,
    portfolioFileUrl: form.files.portfolio,

    education: form.education.map((e) => ({
      educationLevel: mapEducationLevel(e.type),
      schoolName: e.name,
      major: e.type === '대학' || e.type === '대학원' ? e.major : null,
      isGraduated: e.graduated,
      admissionDate: e.startDate,
      graduationDate: e.endDate,
      attendanceType:
        e.type === '대학' || e.type === '대학원' ? mapAttendanceType(e.dayTime) : null,
      gpa: e.type === '대학' || e.type === '대학원' ? Number(e.grade) || null : null,
      gpaScale: e.type === '대학' || e.type === '대학원' ? Number(e.maxGrade) || null : null,
    })),

    experience:
      form.career?.map((c) => ({
        companyName: c.company,
        department: c.department,
        position: c.position,
        startDate: c.startDate,
        endDate: c.endDate,
      })) ?? [],

    skills: form.skills.map((s) => ({
      skillName: s.name,
      proficiencyLevel: mapProficiencyLevel(s.level),
    })),

    activities:
      form.activities
        ?.split('\n')
        .filter(Boolean)
        .map((t) => ({
          title: t,
          type: mapActivityType(),
          organization: '',
        })) ?? [],

    certifications:
      form.certifications
        ?.split('\n')
        .filter(Boolean)
        .map((t) => ({
          name: t,
          type: mapCertificationType(),
          scoreOrLevel: '',
        })) ?? [],
  };
}
