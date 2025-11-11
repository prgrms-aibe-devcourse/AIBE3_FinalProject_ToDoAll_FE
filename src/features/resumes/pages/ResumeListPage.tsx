import { useState, useMemo } from 'react';
import ResumeFilterSection from '../components/ResumeFilterSection';
import ResumeCard from '../components/ResumeCard';
import { mockResumes } from '../data/mockResumes';
import type { ResumeData } from '../types/resumes.types';

export default function ResumeListPage() {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'name'>('latest');
  const [tab, setTab] = useState<'all' | 'recommended'>('all');

  // 필터링 & 정렬
  const filteredResumes = useMemo(() => {
    let result = [...mockResumes];

    // 🔹 탭 필터링
    if (tab === 'recommended') {
      result = result.filter((r) => r.skills.includes('React')); // 예시: React 스킬 있는 사람 추천
    }

    // 🔹 검색 필터링
    if (keyword) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword.toLowerCase()) ||
          r.skills.some((s) => s.toLowerCase().includes(keyword.toLowerCase()))
      );
    }

    // 🔹 정렬
    result.sort((a, b) => {
      if (sortBy === 'latest')
        return new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime();
      if (sortBy === 'oldest')
        return new Date(a.applyDate).getTime() - new Date(b.applyDate).getTime();
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    return result;
  }, [keyword, sortBy, tab]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">지원자 목록</h1>

      {/* 🔹 필터 섹션 */}
      <ResumeFilterSection onSearch={setKeyword} onSortChange={setSortBy} onTabChange={setTab} />

      {/* 🔹 지원자 카드 목록 */}
      <div className="flex flex-col gap-4 mt-6">
        {filteredResumes.length > 0 ? (
          filteredResumes.map((resume: ResumeData) => (
            <ResumeCard
              key={resume.id}
              resume={resume}
              matchRate={Math.floor(Math.random() * 50) + 50} // 매칭률 예시
              onView={() => console.log('보기 클릭', resume.name)}
              onInvite={() => console.log('면접 초대 클릭', resume.name)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center mt-6">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}
