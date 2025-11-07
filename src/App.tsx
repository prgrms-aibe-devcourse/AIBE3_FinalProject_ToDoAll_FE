// src/App.tsx
import React from 'react';
import JobPostList from './features/jd/components/jobpostlist/JobPostList';
import type { JobPost } from './features/jd/types/JobPost.types';

const mockItems: JobPost[] = [
  {
    id: '1',
    title: '시니어 프론트엔드 개발자',
    location: '서울 강남구',
    applicantsCount: 24,
    status: 'OPEN',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    postedAt: '2025-10-15T00:00:00.000Z',
    deadline: '2025-11-20T00:00:00.000Z',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    title: '백엔드 개발자 (Spring)',
    location: '서울 성동구',
    applicantsCount: 12,
    status: 'OPEN',
    skills: ['Java', 'Spring Boot', 'JPA'],
    postedAt: '2025-11-01T00:00:00.000Z',
    deadline: '2025-12-01T00:00:00.000Z',
  },
  {
    id: '3',
    title: '프로덕트 디자이너',
    location: '서울 마포구',
    applicantsCount: 7,
    status: 'CLOSED',
    skills: ['Figma', 'UX', 'UI'],
    postedAt: '2025-09-01T00:00:00.000Z',
  },
];

export default function App() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">공고 관리</h1>
        <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700">
          공고 등록
        </button>
      </header>

      <div className="mx-auto max-w-5xl">
        <JobPostList
          items={mockItems}
          onOpen={(id) => {
            // 여기서 라우팅 또는 모달 열기 등 연결 예정
            console.log('open job id:', id);
            alert(`공고 상세로 이동: ${id}`);
          }}
        />
      </div>
    </main>
  );
}
