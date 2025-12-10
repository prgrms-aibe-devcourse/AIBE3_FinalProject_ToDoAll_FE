import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import MatchFilterSection from '../components/MatchFilterSection';
import MatchCard from '../components/MatchCard';
import NoSearchResult from '../components/NoSearchResult';

import { fetchAllMatchedResumes, confirmMatch } from '../api/matchApi';
import { fetchRecommendedResumes } from '../api/recommendation.api';

import { mapMatchDtoToCardData } from '../utils/mapMatchDtoToCardData';
import { mapRecommendationToCardData } from '../utils/mapRecommendationToResumeData';

import type { MatchCardData } from '../types/matchCardData.types';

export default function MatchListPage() {
  const navigate = useNavigate();

  const [resumes, setResumes] = useState<MatchCardData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<'recommended' | 'all'>('recommended');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [jdId, setJobId] = useState<number | null>(null);
  const [sortType, setSortType] = useState<string>('latest');

  const [searchTrigger, setSearchTrigger] = useState(0); // 🔥 검색 버튼 눌렀을 때만 조회

  // 🔥 조회 로직: 검색 버튼을 눌렀을 때(searchTrigger 변경 시)만 실행됨
  useEffect(() => {
    if (jdId === null) {
      setResumes([]);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        if (tab === 'recommended') {
          const recs = await fetchRecommendedResumes(jdId, limit, sortType);
          setResumes(recs.map(mapRecommendationToCardData));
        } else {
          const all = await fetchAllMatchedResumes(jdId, page, limit, sortType);
          setResumes(all.content.map(mapMatchDtoToCardData));
          setTotalPages(all.totalPages);
        }
      } catch (e) {
        console.error(e);
        setError('지원자 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [searchTrigger, jdId, tab, limit, page, sortType]); // ⭐ 검색 버튼 눌렀을 때(searchTrigger)만 실행됨

  const handleInvite = async (resumeId: number) => {
    if (jdId === null) {
      alert('채용 공고를 선택해주세요.');
      return;
    }
    try {
      await confirmMatch(jdId, resumeId);
      navigate(`/interview/create?resumeId=${resumeId}&jdId=${jdId}`);
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
        onSearch={() => {
          setSearchTrigger((prev) => prev + 1); // 🔥 검색 버튼 눌렀을 때만 조회되도록
          setPage(0);
        }}
        onTabChange={(t) => {
          setTab(t);
          setPage(0);
        }}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(0);
        }}
        onJobChange={(jobId) => {
          setJobId(jobId);
        }}
        onSortChange={(sort) => {
          setSortType(sort);
        }}
      />

      <div className="mt-6 flex flex-col gap-4">
        {loading && <p className="text-center">불러오는 중...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {/* 🔥 JD 선택 전에는 아무것도 보여주지 않음 */}
        {!jdId && !loading && (
          <p className="text-center text-[#8B8B8B]">조회할 공고를 선택하세요.</p>
        )}

        {/* 목록 없음 */}
        {jdId && !loading && !error && resumes.length === 0 && <NoSearchResult />}

        {/* 목록 표시 */}
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

      {tab === 'all' && totalPages > 1 && jdId && (
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
