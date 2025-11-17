import { convertToBackendRequest } from './resumes.mapper.ts';
import type { ResumeData } from '../types/resumes.types';

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
