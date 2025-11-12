import jobdaLogo from '../../../assets/Jobda_logo.png';

export default function NoSearchResult() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#F4EFEF] rounded-lg py-24 px-4 shadow-sm">
      <img src={jobdaLogo} alt="jobda logo" className="w-32 h-auto mb-4" />
      <p className="text-[#DE4F36] font-semibold text-lg mb-2">검색 결과가 없습니다</p>
      <p className="text-[#837C7C] text-sm text-center">검색 필터를 사용하여 지원자를 찾아보세요</p>
    </div>
  );
}
