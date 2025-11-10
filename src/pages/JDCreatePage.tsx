import JobPostForm from '../features/jd/components/form/JobPostForm';
import type { JobPostFormValues } from '../features/jd/components/form/JobPostForm';

export default function JDCreatePage() {
  const handleSubmit = (v: JobPostFormValues) => {
    alert('제출 값: ' + JSON.stringify(v, null, 2));
  };
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <JobPostForm onSubmit={handleSubmit} />
    </main>
  );
}
