import { useState, useRef, useEffect } from 'react';

interface JobPost {
  id: number;
  title: string;
}

interface InterviewSortDropdownProps {
  jobPosts: JobPost[];
  /* eslint-disable-next-line no-unused-vars */
  onSelect: (jdId: number | null) => void;
}

export default function InterviewSortDropdown({ jobPosts, onSelect }: InterviewSortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('전체 보기 ▾');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSelect = (post: JobPost | null) => {
    if (post) {
      setSelected(post.title + ' ▾');
      onSelect(post.id);
    } else {
      setSelected('전체 보기 ▾');
      onSelect(null);
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-jd-gray-black hover:text-jd-black rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm transition"
      >
        {selected}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg">
          {/* 전체 보기 */}
          <button
            onClick={() => handleSelect(null)}
            className="text-jd-black block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
          >
            전체 보기
          </button>

          <div className="my-1 border-t border-gray-100" />

          {/* 공고 리스트 */}
          {jobPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => handleSelect(post)}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              {post.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
