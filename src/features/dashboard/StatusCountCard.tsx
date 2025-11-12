import Badge from '../../components/dashboard/Badge.tsx';

export default function StatusCountCard() {
  return (
    <section className="border-jd-gray-light flex w-full flex-row items-center justify-between rounded-[10px] border p-[20px]">
      <div className="flex flex-col">
        <h3 className="font-bold">진행 중</h3>
        <p className="text-jd-gray-dark text-sm">현재 모집 중인 공고</p>
      </div>
      <Badge text="5개" color="scarlet" />
    </section>
  );
}
