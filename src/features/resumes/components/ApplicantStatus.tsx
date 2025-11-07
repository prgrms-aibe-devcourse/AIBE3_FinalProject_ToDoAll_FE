import checkImg from '../../../assets/Done.png';
import prohibitionImg from '../../../assets/iconoir_prohibition.png';

interface ApplicantStatusProps {
  data: {
    name: string;
    skills: string[];
  };
}

export default function ApplicantStatus({ data }: ApplicantStatusProps) {
  return (
    <div className="flex items-center justify-between rounded-lg p-4 w-96">
      <div>
        <h3 className="text-[35px] font-semibold">{data.name}</h3>
        <div className="flex gap-2">
          <button
            style={{ borderColor: '#837C7C' }}
            className="border px-3 py-1 rounded-lg flex items-center gap-2 text-[#837C7C] 
             hover:bg-[#E6F5E6] hover:text-[#1E4621]"
          >
            합격
            <img src={checkImg} alt="done" className="w-4 h-4" />
          </button>

          <button
            style={{ borderColor: '#DE4F36' }}
            className="border px-3 py-1 rounded-lg flex items-center gap-2 text-[#DE4F36] 
             hover:bg-[#FDE9E6] hover:text-[#A31D0D]"
          >
            불합격
            <img src={prohibitionImg} alt="prohibition" className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
