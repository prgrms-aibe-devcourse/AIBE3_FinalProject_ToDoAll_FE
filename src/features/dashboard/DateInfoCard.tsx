import { Calendar } from 'lucide-react';

export default function DateInfoCard() {
  return (
    <section className="flex items-center gap-7 border border-jd-gray-light rounded-[10px] p-[20px]">
      <div className="flex items-center justify-center w-[36px] h-[36px] relative before:absolute before:z-0 before:opacity-25 before:block before:w-[36px] before:h-[36px] before:rounded-4xl before:bg-jd-scarlet">
        <Calendar size="20px" className="text-jd-scarlet" />
      </div>
      <p>11/1</p>
      <div>
        <h3 className="font-bold">김상진 님과의 면접</h3>
        <p className="text-jd-gray-dark mb-1">시니어 프론트엔드 개발자</p>
        <p className="text-jd-gray-dark">14:00 · 면접관 1, 면접관 2</p>
      </div>
    </section>
  );
}
