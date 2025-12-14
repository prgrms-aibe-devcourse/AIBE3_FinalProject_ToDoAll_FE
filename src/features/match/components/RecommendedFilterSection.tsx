import arrowImg from '../../../assets/Expand Arrow-2.png';

function RecommendedFilterSection({
  selectedJob,
  onJobChange,
  sortType,
  onSortChange,
  selectedLimit,
  onLimitChange,
  jdOptions,
}: any) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* JD 선택 */}
      <div className="flex flex-col">
        <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">채용 공고</h2>
        <select
          value={selectedJob ?? ''}
          onChange={onJobChange}
          className="rounded-md border border-[#E3DBDB] p-2 text-[15px] text-[#413F3F]"
        >
          <option value="">조회할 공고 선택</option>
          {jdOptions.map((jd: any) => (
            <option key={jd.jdId} value={jd.jdId}>
              {jd.title}
            </option>
          ))}
        </select>
      </div>

      {/* 추천 인원 */}
      <div className="flex flex-col">
        <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">추천 인원</h2>
        <select
          value={selectedLimit}
          onChange={onLimitChange}
          className="w-full rounded-md border border-[#E3DBDB] bg-white p-2 pr-10 text-[15px] text-[#413F3F]"
        >
          <option value={3}>3명</option>
          <option value={5}>5명</option>
          <option value={10}>10명</option>
          <option value={20}>20명</option>
          <option value={30}>30명</option>
        </select>

        <img src={arrowImg} className="pointer-events-none absolute top-9 right-2 h-4 w-4" />
      </div>

      {/* 정렬 */}
      <div className="flex flex-col">
        <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">정렬순</h2>
        <select
          value={sortType}
          onChange={onSortChange}
          className="rounded-md border border-[#E3DBDB] p-2 text-[15px] text-[#413F3F]"
        >
          <option value="SCORE_DESC">점수 높은순</option>
          <option value="LATEST">최신순</option>
        </select>
      </div>
    </div>
  );
}

export default RecommendedFilterSection;
