import { Calendar } from 'lucide-react';

export type DataInfoCardProps = {
  interviewDate: string;
  applicantName: string;
  jobTitle: string;
  interviewTime: string;
  interviewers: string;
};

export default function DateInfoCard({
  interviewDate,
  applicantName,
  jobTitle,
  interviewTime,
  interviewers,
}: DataInfoCardProps) {
  return (
    <section className="border-jd-gray-light flex flex-col items-center gap-4 rounded-[10px] border p-[20px] sm:flex-row md:gap-7">
      <div className="before:bg-jd-scarlet relative flex h-[36px] w-[36px] items-center justify-center before:absolute before:z-0 before:block before:h-[36px] before:w-[36px] before:rounded-4xl before:opacity-25">
        <Calendar size="20px" className="text-jd-scarlet" />
      </div>
      <p>{interviewDate}</p>
      <div className="text-center sm:text-left">
        <h3 className="font-bold">{applicantName} 님과의 면접</h3>
        <p className="text-jd-gray-dark mb-1">{jobTitle}</p>
        <p className="text-jd-gray-dark">
          {interviewTime} · {interviewers}
        </p>
      </div>
    </section>
  );
}
