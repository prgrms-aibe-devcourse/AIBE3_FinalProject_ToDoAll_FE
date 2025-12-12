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
    education: resume.education.map((e) => {
      // 프론트엔드 표시값 → 백엔드 Enum 변환
      let educationLevel: 'ELEMENTARY' | 'MIDDLE' | 'HIGH' | 'UNIVERSITY_ABOVE';
      if (e.type === '초등학교') educationLevel = 'ELEMENTARY';
      else if (e.type === '중학교') educationLevel = 'MIDDLE';
      else if (e.type === '고등학교') educationLevel = 'HIGH';
      else if (e.type === '대학' || e.type === '대학원') educationLevel = 'UNIVERSITY_ABOVE';
      else educationLevel = 'UNIVERSITY_ABOVE'; // 기본값

      // gpa, gpaScale은 @Positive이므로 0보다 큰 값이어야 함
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
        ? [] // 빈 문자열이면 빈 배열
        : resume.activities
            .split(',')
            .map((v) => v.trim())
            .filter((v) => v.length > 0)
            .map((v) => {
              // 프론트엔드 형식: "타입:제목:기관" (예: "활동:봉사활동:지역센터")
              const parts = v.split(':').map((p) => p.trim());
              let activityType: 'ACTIVITY' | 'EDUCATION' | 'PROJECT' = 'ACTIVITY';
              let title = '';
              let organization = '';

              if (parts.length >= 2) {
                // 타입:제목:기관 형식
                const frontendType = parts[0];
                title = parts[1] || '';
                organization = parts[2] || '';

                // 프론트엔드 표시값 → 백엔드 Enum 변환
                if (frontendType === '활동') activityType = 'ACTIVITY';
                else if (frontendType === '교육') activityType = 'EDUCATION';
                else if (frontendType === '경험') activityType = 'PROJECT';
              } else {
                // 형식이 맞지 않으면 건너뜀
                return null;
              }

              // 백엔드 @NotBlank 검증: title과 organization 모두 필수
              if (!title || title.trim().length === 0) {
                return null; // 제목이 없으면 null 반환 (필터링됨)
              }

              // 백엔드 @NotBlank 검증: organization이 필수
              // 빈 문자열이면 기본값 제공 (프론트엔드에서 필수 입력으로 만들지 않는 경우 대비)
              if (!organization || organization.trim().length === 0) {
                organization = '-'; // @NotBlank 검증을 위한 기본값
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
        // 프론트엔드 형식: "타입:이름:점수" (예: "자격:정보처리기사:", "어학:토익:850")
        const parts = v.split(':');
        let certType: 'LICENSE' | 'LANGUAGE' | 'AWARD' = 'LICENSE';
        let name = v;
        let scoreOrLevel: string | null = null;

        if (parts.length >= 2) {
          // 타입:이름:점수 형식
          const frontendType = parts[0].trim();
          name = parts[1]?.trim() || '';

          // 프론트엔드 표시값 → 백엔드 Enum 변환
          if (frontendType === '자격') certType = 'LICENSE';
          else if (frontendType === '어학') certType = 'LANGUAGE';
          else if (frontendType === '수상') certType = 'AWARD';

          // scoreOrLevel은 @Positive 검증이 있지만 String 타입
          // 값이 있고 양수인 경우에만 설정 (빈 문자열이면 null)
          const scoreValue = parts[2]?.trim();
          if (scoreValue && scoreValue.length > 0) {
            const numValue = Number(scoreValue);
            if (!isNaN(numValue) && numValue > 0) {
              scoreOrLevel = scoreValue;
            }
          }
        }

        // 백엔드 @NotBlank 검증: name이 필수
        if (!name || name.trim().length === 0) {
          return null; // 이름이 없으면 null 반환 (필터링됨)
        }

        return {
          name: name.trim(),
          type: certType,
          // null이면 @Positive 검증이 스킵될 수 있음
          scoreOrLevel: scoreOrLevel || null,
        };
      })
      .filter((cert): cert is NonNullable<typeof cert> => cert !== null), // null 항목 필터링

    // File 객체가 있으면 undefined로 설정 (백엔드에서 새 파일 업로드)
    // File 객체가 없고 resumeKey가 있으면 기존 파일 재사용
    resumeFileUrl:
      resume.files.resume instanceof File ? undefined : resume.files.resumeKey || undefined,
    portfolioFileUrl:
      resume.files.portfolio instanceof File ? undefined : resume.files.portfolioKey || undefined,
  };
}
