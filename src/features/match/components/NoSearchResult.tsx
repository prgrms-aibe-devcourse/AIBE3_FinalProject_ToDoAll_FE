import jobdaLogo from '../../../assets/Jobda_logo.png';

export default function NoSearchResult() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-[#F4EFEF] px-4 py-24 shadow-sm">
      <img src={jobdaLogo} alt="jobda logo" className="mb-4 h-auto w-32" />
      <p className="mb-2 text-lg font-semibold text-[#DE4F36]">검색 결과가 없습니다</p>
      <p className="text-center text-sm text-[#837C7C]">검색 필터를 사용하여 지원자를 찾아보세요</p>
    </div>
  );
}
