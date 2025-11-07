type ResumeData = {
  name: string;
  email: string;
  phone: string;
  applyDate: string;
  birth: string;
  address: string;
  profileImage: string;
  education: string;
  experience: string;
  skills: string[];
  files: {
    resume: string;
    portfolio: string;
  };
};

export default function ResumeInfo({ data }: { data: ResumeData }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">{data.name}</h2>
          <p className="text-gray-500">프론트엔드 개발자 지원</p>
        </div>
        <img
          src={data.profileImage}
          alt="profile"
          className="w-24 h-24 rounded-full object-cover"
        />
      </header>

      <div className="space-y-4 text-sm">
        <div>
          <b>이메일:</b> {data.email}
        </div>
        <div>
          <b>연락처:</b> {data.phone}
        </div>
        <div>
          <b>접수일:</b> {data.applyDate}
        </div>
        <div>
          <b>생년월일:</b> {data.birth}
        </div>
        <div>
          <b>주소:</b> {data.address}
        </div>
      </div>

      <section className="mt-6">
        <h3 className="font-semibold border-b pb-1 mb-2">학력사항</h3>
        <p>{data.education}</p>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold border-b pb-1 mb-2">경력사항</h3>
        <p>{data.experience}</p>
      </section>

      <section className="mt-4">
        <h3 className="font-semibold border-b pb-1 mb-2">스킬</h3>
        <ul className="flex gap-2 flex-wrap">
          {data.skills.map((skill) => (
            <li key={skill} className="px-3 py-1 bg-gray-100 rounded-lg text-gray-700">
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="font-semibold border-b pb-1 mb-2">첨부파일</h3>
        <div className="flex flex-col gap-2">
          <a href="#" className="text-blue-500 underline">
            📎 {data.files.resume}
          </a>
          <a href="#" className="text-blue-500 underline">
            📎 {data.files.portfolio}
          </a>
        </div>
      </section>
    </div>
  );
}
