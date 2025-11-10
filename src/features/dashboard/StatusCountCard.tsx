import Badge from '../../components/dashboard/Badge.tsx';

export default function StatusCountCard() {
  return (
    <section className="w-full flex flex-row justify-between items-center border border-jd-gray-light rounded-[10px] p-[20px]">
      <div className="flex flex-col">
        <h3 className="font-bold">진행 중</h3>
        <p className="text-sm text-jd-gray-dark">현재 모집 중인 공고</p>
      </div>
      <Badge text="5개" color="scarlet" />
    </section>
  );
}
