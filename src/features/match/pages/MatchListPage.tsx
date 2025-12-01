import { useState, useEffect } from 'react';
import MatchFilterSection from '../components/MatchFilterSection';
import MatchCard from '../components/MatchCard';
import NoSearchResult from '../components/NoSearchResult';
import { fetchRecommendedResumes } from '../api/recommendation.api';
import { mapRecommendationToResumeData } from '../utils/mapRecommendation';
import type { ResumeData } from '../../resumes/types/resumes.types';

export default function MatchListPage() {
  const [resumes, setResumes] = useState<
    (ResumeData & { summary?: string; matchScore?: number })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [limit, setLimit] = useState(10); // 추천 인원 수
  const JD_ID = 2001;

  const load = async () => {
    setLoading(true);
    try {
      const recommendations = await fetchRecommendedResumes(JD_ID, limit);
      const mapped = recommendations.map(mapRecommendationToResumeData);
      setResumes(mapped);
    } catch (e) {
      console.error(e);
      setError('추천 이력서를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [JD_ID, limit]); // limit이 바뀔 때마다 재호출

  return (
    <div className="min-h-screen bg-[#FAF8F8] p-6">
      <h1 className="mb-6 text-2xl font-semibold text-[#413F3F]">추천된 지원자</h1>

      <MatchFilterSection
        onSearch={() => {}}
        onTabChange={() => {}}
        onLimitChange={(value) => setLimit(value)} // 필터 컴포넌트에서 전달받은 값 반영
      />

      <div className="mt-6 flex flex-col gap-4">
        {loading && <p className="text-center">불러오는 중...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && resumes.length === 0 && <NoSearchResult />}
        {!loading &&
          !error &&
          resumes.map((resume) => (
            <MatchCard
              key={resume.id}
              resume={resume}
              matchRate={resume.matchScore ?? 0}
              onView={() => console.log('보기 클릭', resume.name)}
              onInvite={() => console.log('면접 초대 클릭', resume.name)}
            />
          ))}
      </div>
    </div>
  );
}
