import { useState, useEffect } from 'react';
import MatchFilterSection from '../components/MatchFilterSection';
import MatchCard from '../components/MatchCard';
import NoSearchResult from '../components/NoSearchResult';

import { fetchAllMatchedResumes } from '../api/matchApi';
import { mapMatchDtoToCardData } from '../utils/mapMatchDtoToCardData';
import { mapRecommendationToCardData } from '../utils/mapRecommendationToResumeData';
import type { MatchCardData } from '../types/matchCardData.types';
import { fetchRecommendedResumes } from '../api/recommendation.api';

export default function MatchListPage() {
  const [resumes, setResumes] = useState<MatchCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<'recommended' | 'all'>('recommended');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const JD_ID = 2001;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (tab === 'recommended') {
          const recs = await fetchRecommendedResumes(JD_ID, limit);
          setResumes(recs.map(mapRecommendationToCardData));
        } else {
          const all = await fetchAllMatchedResumes(JD_ID, page, limit);
          setResumes(all.content.map(mapMatchDtoToCardData));
          setTotalPages(all.totalPages);
        }
      } catch (_e) {
        console.error(_e);
        setError('지원자 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [tab, limit, page]);

  return (
    <div className="min-h-screen bg-[#FAF8F8] p-6">
      <h1 className="mb-6 text-2xl font-semibold text-[#413F3F]">
        {tab === 'recommended' ? '추천된 지원자' : '전체 지원자'}
      </h1>

      <MatchFilterSection
        onSearch={() => {}}
        onTabChange={(t) => {
          setTab(t);
          setPage(0);
        }}
        onLimitChange={setLimit}
      />

      <div className="mt-6 flex flex-col gap-4">
        {loading && <p className="text-center">불러오는 중...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && resumes.length === 0 && <NoSearchResult />}

        {!loading &&
          !error &&
          resumes.map((resume) => (
            <MatchCard
              key={resume.resumeId}
              resume={resume}
              matchRate={resume.matchScore ?? 0}
              onView={() => console.log('보기 클릭', resume.name)}
              onInvite={() => console.log('면접 초대 클릭', resume.name)}
            />
          ))}
      </div>

      {tab === 'all' && totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-4">
          <button disabled={page === 0} onClick={() => setPage((p) => Math.max(p - 1, 0))}>
            이전
          </button>
          <span>
            {page + 1} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
