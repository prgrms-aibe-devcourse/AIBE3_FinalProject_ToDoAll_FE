function AllFilterSection({
  selectedJob,
  onJobChange,
  sortType,
  onSortChange,
  jdOptions,
  status,
  onStatusChange,
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

      {/* 지원 상태 */}
      <div className="flex w-full flex-col">
        <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">지원자 상태</h2>
        <select
          value={status}
          onChange={onStatusChange}
          className="w-full rounded-md border border-[#E3DBDB] p-2 text-[15px] text-[#413F3F]"
        >
          <option value="">전체 상태</option>
          <option value="APPLIED">지원됨</option>
          <option value="RECOMMENDED">추천됨</option>
          <option value="CONFIRMED">매칭 확정됨</option>
        </select>
      </div>

      {/* 정렬 */}
      <div className="flex flex-col">
        <h2 className="mb-1 text-[14px] font-medium text-[#413F3F]">정렬순</h2>
        <select
          value={sortType}
          onChange={onSortChange}
          className="rounded-md border border-[#E3DBDB] p-2 text-[15px] text-[#413F3F]"
        >
          <option value="LATEST">최신순</option>
          <option value="SCORE_DESC">매칭 높은순</option>
        </select>
      </div>
    </div>
  );
}

export default AllFilterSection;
