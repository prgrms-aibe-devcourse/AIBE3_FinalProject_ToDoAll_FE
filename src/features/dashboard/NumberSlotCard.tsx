import Badge from '../../components/dashboard/Badge.tsx';

function SlotCard() {
  return (
    <section className="flex flex-col justify-center align-middle text-center">
      <p className="text-5xl font-bold">18</p>
      <p className="font-semibold">지원자</p>
    </section>
  );
}

export default function NumberSlotsCard() {
  return (
    <section className="relative bg-white rounded-[10px] flex flex-col p-[20px] border-1 border-jd-gray-light">
      <h3 className="font-bold text-jd-black mb-[20px]">시니어 프론트엔드 개발자</h3>
      <section className="flex flex-row justify-around mb-[10px]">
        <SlotCard />
        <SlotCard />
        <SlotCard />
        <SlotCard />
      </section>
      <section className="w-full h-[10px] rounded-[90px] bg-jd-scarlet opacity-25"></section>
      <Badge text="진행중" color="scarlet" className="absolute top-[20px] right-[20px]" />
    </section>
  );
}
