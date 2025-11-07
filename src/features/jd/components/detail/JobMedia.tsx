export function JobMedia({ src }: { src?: string }) {
  if (!src) return null;
  return (
    <div className="overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200">
      <img src={src} alt="공고 이미지" className="w-full h-auto object-cover" />
    </div>
  );
}
