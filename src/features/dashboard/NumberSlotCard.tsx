import Badge from '../../components/dashboard/Badge.tsx';

function SlotCard() {
  return (
    <section className="flex flex-col justify-center text-center align-middle">
      <p className="text-5xl font-bold">18</p>
      <p className="font-semibold">지원자</p>
    </section>
  );
}

export default function NumberSlotsCard() {
  return (
    <section className="border-jd-gray-light relative flex flex-col items-center gap-2 rounded-[10px] border-1 bg-white p-[20px] sm:items-start">
      <Badge text="진행중" color="scarlet" className="static top-[20px] right-[20px] sm:absolute" />
      <h3 className="text-jd-black font-bold">시니어 프론트엔드 개발자</h3>
      <section className="mb-[10px] flex w-full flex-row flex-wrap justify-around gap-6 sm:gap-4">
        <SlotCard />
        <SlotCard />
        <SlotCard />
        <SlotCard />
      </section>
      <section className="bg-jd-scarlet h-[10px] w-full rounded-[90px] opacity-25"></section>
    </section>
  );
}
