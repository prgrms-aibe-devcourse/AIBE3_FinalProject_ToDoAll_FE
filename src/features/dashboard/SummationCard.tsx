import DetailButton from '../../components/dashboard/DetailButton.tsx';
import { BookText } from 'lucide-react';

export default function SummationCard() {
  return (
    <div className="w-full max-w-[279px] flex flex-col justify-between relative aspect-[12/8] bg-white rounded-[20px] p-[30px] jd-dashboard-section">
      <h2 className="font-bold text-jd-gray-dark mb-[20px]">활성 공고</h2>
      <div>
        <h3 className="text-4xl font-semibold text-gray-700">12</h3>
        <p className="text-sm font-light text-gray-500">진행 중인 채용 공고</p>
      </div>
      <DetailButton />
      <BookText className="absolute top-[30px] right-[30px] text-jd-gray-dark" size="20px" />
    </div>
  );
}
