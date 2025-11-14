import { useState, useMemo } from 'react';
import MatchFilterSection from '../components/MatchFilterSection';
import MatchCard from '../components/MatchCard';
import { mockResumes } from '../data/mockResumes';
import type { ResumeData } from '../../resumes/types/resumes.types';
import NoSearchResult from '../components/NoSearchResult';

export default function MatchListPage() {
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'name'>('latest');
  const [tab, setTab] = useState<'all' | 'recommended'>('all');

  const filteredResumes = useMemo(() => {
    let result = [...mockResumes];

    if (tab === 'recommended') {
      result = result.filter((r) => r.skills.some((s) => s.name === 'React')); // 예시: React 스킬 있는 사람 추천
    }

    if (keyword) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(keyword.toLowerCase()) ||
          r.skills.some((s) => s.name.toLowerCase().includes(keyword.toLowerCase()))
      );
    }

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
    <div className="min-h-screen bg-[#FAF8F8] p-6">
      <h1 className="mb-6 text-2xl font-semibold text-[#413F3F]">지원자 조회</h1>

      <MatchFilterSection onSearch={setKeyword} onSortChange={setSortBy} onTabChange={setTab} />

      <div className="mt-6 flex flex-col gap-4">
        {filteredResumes.length > 0 ? (
          filteredResumes.map((resume: ResumeData) => (
            <MatchCard
              key={resume.id}
              resume={resume}
              matchRate={Math.floor(Math.random() * 50) + 50} // 매칭률 예시
              onView={() => console.log('보기 클릭', resume.name)}
              onInvite={() => console.log('면접 초대 클릭', resume.name)}
            />
          ))
        ) : (
          <NoSearchResult />
        )}
      </div>
    </div>
  );
}
