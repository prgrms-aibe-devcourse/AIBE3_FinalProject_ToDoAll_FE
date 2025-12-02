import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import MatchFilterSection from '../components/MatchFilterSection';
import MatchCard from '../components/MatchCard';
import NoSearchResult from '../components/NoSearchResult';

import { fetchAllMatchedResumes, confirmMatch } from '../api/matchApi';
import { fetchRecommendedResumes } from '../api/recommendation.api';

import { mapMatchDtoToCardData } from '../utils/mapMatchDtoToCardData';
import { mapRecommendationToCardData } from '../utils/mapRecommendationToResumeData';

import type { MatchCardData } from '../types/matchCardData.types';

export default function MatchListPage() {
  const { id } = useParams<{ id: string }>();
  const JD_ID = Number(id);
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<MatchCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<'recommended' | 'all'>('recommended');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!JD_ID) return;
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
  }, [JD_ID, tab, limit, page]);

  const handleInvite = async (resumeId: number) => {
    try {
      await confirmMatch(JD_ID, resumeId);
      console.log('매칭 확정 성공');
      navigate(`/interview/create?resumeId=${resumeId}&jdId=${JD_ID}`);
    } catch (error) {
      console.error('매칭 확정 실패:', error);
      alert('이미 매칭된 지원자이거나 오류가 발생했습니다.');
    }
  };

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
              onInvite={() => handleInvite(resume.resumeId)}
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
